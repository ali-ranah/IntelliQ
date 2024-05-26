const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const util = require('util');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const app = express();
app.use(bodyParser.json());

const corsOptions = {
    origin: '*', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
const db = new sqlite3.Database('./IntelliQ.db');
const sqlFilePath = 'data/sqll.sql';
const sqlStatements = fs.readFileSync(sqlFilePath, 'utf8');


const initializeDatabase = () => {

    db.serialize(() => {
        db.run(
            'CREATE TABLE IF NOT EXISTS registered_accounts (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, password TEXT, profile_picture BLOB, age INTEGER);'
        );

        db.run(
            'CREATE TABLE IF NOT EXISTS registered_accounts_with_google (id INTEGER PRIMARY KEY AUTOINCREMENT,email TEXT, name TEXT, profile_picture BLOB, age INTEGER);'
        );

        db.run(
            'CREATE TABLE IF NOT EXISTS registered_accounts_reset (email TEXT, verification_code TEXT);'
        );
        db.run(
            'CREATE TABLE IF NOT EXISTS scores (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, score INTEGER, FOREIGN KEY(user_id) REFERENCES registered_accounts(id));'
        );
        db.run(
            'CREATE TABLE IF NOT EXISTS google_scores (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, score INTEGER, FOREIGN KEY(user_id) REFERENCES registered_accounts_with_google(id));'
        );
        

        db.exec(sqlStatements, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log('Table created and data inserted successfully');
            }
        });
    });
};

initializeDatabase();

// Route to handle user registration with Google or password
app.post('/signup', async (req, res) => {
    console.log('Received signup request');
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Check if the email already exists
    db.get('SELECT * FROM registered_accounts WHERE email = ?', [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking account existence' });
        } else if (row) {
            // Account with the same email already exists
            return res.status(400).json({ error: 'Account with this email already exists' });
        }

        // Email is unique, proceed with account creation
        db.run(
            'INSERT INTO registered_accounts (name, email, password) VALUES (?, ?, ?);',
            [name, email, hashedPassword],
            (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error adding account' });
                } else {
                    res.status(200).json({ message: 'Account added successfully' });
                }
            }
        );
    });
});

// Route to handle user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check if the email exists
    db.get('SELECT * FROM registered_accounts WHERE email = ?', [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking account existence' });
        } else if (!row) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Email exists, check the password
        const passwordMatch = await bcrypt.compare(password, row.password);

        if (passwordMatch) {
            // Retrieve the user's name
            const userName = row.name;

            res.status(200).json({ message: 'Login successful', name: userName });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    });
});

// Route to handle user registration with Google
app.post('/signupwithgoogle', async (req, res) => {
    console.log('Received signup with google request');
    const { email } = req.body;

    // Check if the email already exists in the Google signup table
    db.get('SELECT * FROM registered_accounts_with_google WHERE email = ?', [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking account existence' });
        } else if (row) {
            return res.status(200).json({ error: 'Account with this email already exists' });
        }

        // Email does not exist, proceed with account creation
        // Insert the user into the Google signup table
        db.run('INSERT INTO registered_accounts_with_google (email) VALUES (?);', [email], async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error adding account to the database' });
            }

            // No need to send a response for a successful insertion
            res.status(200).send();
        });
    });
});

const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = (email, code) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'reset.intelliq@gmail.com',
            pass: 'gxtmgdqrvreuqyzz',
        },
    });

    const mailOptions = {
        from: 'reset.intelliq@gmail.com',
        to: email,
        subject: 'Verification Code',
        text: `Your verification code is: ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending verification code email:', error);
        } else {
            console.log('Verification code email sent:', info.response);
        }
    });
};

// Route to handle sending the reset link
app.post('/send-verification-code', async (req, res) => {
    const { email } = req.body;

    // Check if the email exists in the database
    db.get('SELECT * FROM registered_accounts WHERE email = ?;', [email], async (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error checking account existence' });
        } else if (!row) {
            return res.status(404).json({ error: 'Account with this email does not exist' });
        }

        // Generate a verification code
        const verificationCode = generateVerificationCode();
        db.run('CREATE TABLE IF NOT EXISTS registered_accounts_reset (email TEXT, verification_code TEXT);', async (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error creating reset table' });
            }

            // Store the verification code in the database
            db.run(
                'INSERT INTO registered_accounts_reset (email, verification_code) VALUES (?, ?);',
                [email, verificationCode],
                async (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Error updating verification code' });
                    }

                    // Send the verification code to the user's email
                    sendVerificationEmail(email, verificationCode);

                    // No need to send a response for a successful verification code generation
                    res.status(200).send();
                });
        });
    });
});

// Route to handle verifying the code and updating the password
app.post('/verify-code-and-update-password', async (req, res) => {
    const hashAsync = util.promisify(bcrypt.hash);
    const { email, verificationCode, newPassword } = req.body;

    try {
        // Check if the verification code exists and is still valid
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM registered_accounts_reset WHERE email = ? AND verification_code = ?',
                [email, verificationCode], (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row);
                    }
                });
        });

        if (row) {
            // Code is valid, remove verification_code from the user record
            db.run('UPDATE registered_accounts_reset SET verification_code = NULL WHERE email = ?;', [email], async (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error updating user record' });
                }

                try {
                    // Update the user's password
                    const hashedPassword = await hashAsync(newPassword, 10);

                    db.run('UPDATE registered_accounts SET password = ? WHERE email = ?;', [hashedPassword, email], (updateErr) => {
                        if (updateErr) {
                            return res.status(500).json({ error: 'Error updating password' });
                        }

                        // Drop the registered_accounts_reset table
                        db.run('DROP TABLE IF EXISTS registered_accounts_reset;', (dropErr) => {
                            if (dropErr) {
                                return res.status(500).json({ error: 'Error dropping reset table' });
                            }

                            res.status(200).json({ message: 'Password updated successfully' });
                        });
                    });
                } catch (hashErr) {
                    return res.status(500).json({ error: 'Error hashing the new password' });
                }
            });
        } else {
            res.status(401).json({ error: 'Invalid verification code or code has expired' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error checking verification code' });
    }
});

app.post('/update-password', async (req, res) => {
    const { email, currentPassword, newPassword } = req.body;
    const hashAsync = util.promisify(bcrypt.hash);

    try {
        // Check if the email exists in the database
        const row = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM registered_accounts WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject('Error checking account existence');
                } else {
                    resolve(row);
                }
            });
        });

        if (!row) {
            return res.status(401).json({ error: 'Account Doesnt Exist' });
        }

        // Email exists, check the password
        const passwordMatch = await bcrypt.compare(currentPassword, row.password);

        if (passwordMatch) {
            // Update the user's password
            try {
                const hashedPassword = await hashAsync(newPassword, 10);

                db.run('UPDATE registered_accounts SET password = ? WHERE email = ?', [hashedPassword, email], (updateErr) => {
                    if (updateErr) {
                        return res.status(500).json({ error: 'Error updating password' });
                    }

                    res.status(200).json({ message: 'Password updated successfully' });
                });
            } catch (hashErr) {
                return res.status(500).json({ error: 'Error hashing the new password' });
            }
        } else {
            res.status(401).json({ error: 'Invalid Current Password Entered' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error checking account existence' });
    }
});

app.post('/user_details', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the database
        db.get('SELECT name, age FROM registered_accounts WHERE email = ?;', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error checking account existence' });
            } else if (!row) {
                return res.status(404).json({ error: 'Account with this email does not exist' });
            }

            // Send the user details (name) as a response
            res.status(200).json({ name: row.name, age: row.age });
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/user_details_google', async (req, res) => {
    const { email } = req.body;

    try {
        // Check if the email exists in the Google sign-in table
        db.get('SELECT name, age FROM registered_accounts_with_google WHERE email = ?;', [email], async (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error checking account existence' });
            } else if (!row) {
                return res.status(404).json({ error: 'Account with this email does not exist' });
            }

            // Send the user details (name) as a response
            res.status(200).json({ name: row.name,age: row.age });
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/update-details', async (req, res) => {
    const { email, newName, newAge } = req.body;

    // Update the user's name and age in the database
    db.run('UPDATE registered_accounts SET name = ?, age = ? WHERE email = ?;', [newName, newAge, email], async (err) => {
        if (err) {
            console.error('Error updating name and age:', err);
            return res.status(500).json({ error: 'Error updating name and age' });
        }

        // Successfully updated the name and age
        res.status(200).json({ message: 'Name and age updated successfully' });
    });
});

app.post('/update-details-google', async (req, res) => {
    const { email, newName, newAge } = req.body;

    // Update the user's name and age in the database for Google accounts
    db.run('UPDATE registered_accounts_with_google SET name = ?, age = ? WHERE email = ?;', [newName, newAge, email], async (err) => {
        if (err) {
            console.error('Error updating name and age for Google account:', err);
            return res.status(500).json({ error: 'Error updating name and age for Google account' });
        }

        // Successfully updated the name and age for Google account
        res.status(200).json({ message: 'Name and age updated successfully for Google account' });
    });
});




// app.post('/mcqs', (req, res) => {
//     db.all('SELECT * FROM mcqs_question ORDER BY RANDOM() LIMIT 1;', (err, rows) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Internal Server Error' });
//             return;
//         }

//         if (rows.length > 0) {
//             res.json(rows[0]);
//         } else {
//             res.status(404).json({ error: 'No questions available' });
//         }
//     });
// });


app.post('/verbal-mcqs', (req, res) => {
    // First, select a random question
    db.get('SELECT * FROM Verbal_Questions ORDER BY RANDOM() LIMIT 1;', (err, questionRow) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (questionRow) {
            const questionId = questionRow.question_id;

            // Then, select the options for the chosen question
            db.all('SELECT option_text, is_correct FROM Verbal_Options WHERE question_id = ?;', [questionId], (err, optionRows) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                if (optionRows.length > 0) {
                    res.json({
                        question: questionRow,
                        options: optionRows
                    });
                } else {
                    res.status(404).json({ error: 'No options available for the selected question' });
                }
            });
        } else {
            res.status(404).json({ error: 'No questions available' });
        }
    });
});

app.post('/image-mcqs', (req, res) => {
    // First, select a random question
    db.get('SELECT * FROM Image_Questions ORDER BY RANDOM() LIMIT 1;', (err, questionRow) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (questionRow) {
            const questionId = questionRow.question_id;

            // Then, select the options for the chosen question
            db.all('SELECT option_text, is_correct FROM Image_Options WHERE question_id = ?;', [questionId], (err, optionRows) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }

                if (optionRows.length > 0) {
                    res.json({
                        question: questionRow,
                        options: optionRows
                    });
                } else {
                    res.status(404).json({ error: 'No options available for the selected question' });
                }
            });
        } else {
            res.status(404).json({ error: 'No questions available' });
        }
    });
});


app.post('/numerical-reasoning-mcqs', (req, res) => {
    // Select a random question from the database
    db.get('SELECT * FROM numerical_reasoning_questions ORDER BY RANDOM() LIMIT 1;', (err, questionRow) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }

        if (questionRow) {
            // Prepare the response object with the question and its options
            const question = {
                id: questionRow.id,
                question_text: questionRow.question_text,
                is_correct: questionRow.correct_answer,
                options: {
                    option_a: questionRow.option_a,
                    option_b: questionRow.option_b,
                    option_c: questionRow.option_c,
                    option_d: questionRow.option_d,
                }
            };

            res.json(question);
        } else {
            res.status(404).json({ error: 'No questions available' });
        }
    });
});


app.post('/upload/:email', upload.single('image'), async (req, res) => {
    try {
        const { email } = req.params; // Get email from the route params

        // Ensure the 'uploads/profiles' directory exists
        const uploadDir = path.join(__dirname, 'uploads', 'profiles');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Get the uploaded file data
        const imageBuffer = req.file.buffer;

        // Use sharp to resize and lower the quality of the image
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 300, height: 300 }) // Adjust the dimensions as needed
            .jpeg({ quality: 50 }) // Set the desired quality (0-100)
            .toBuffer();

        // Save the resized file to the specified destination
        const targetPath = path.join(uploadDir, `${email}_profile_picture.jpg`);
        fs.writeFileSync(targetPath, resizedImageBuffer);

        // Update the profile picture in the database
        db.run('UPDATE registered_accounts SET profile_picture = ? WHERE email = ?;', [resizedImageBuffer, email], (err) => {
            if (err) {
                console.error('Error updating profile picture in the database:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Send a success message upon successful upload
                res.status(200).json({ message: 'Profile picture uploaded successfully' });
            }
        });
    } catch (error) {
        console.error('Error uploading profile picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Modify the /get_profile_picture endpoint to use GET
app.get('/get_profile_picture/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Check if the email exists in the database and has a profile picture
        db.get('SELECT profile_picture FROM registered_accounts WHERE email = ?;', [email], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching profile picture' });
            }

            // If the row exists and has a profile picture, send the image data
            if (row && row.profile_picture) {
                const base64Image = row.profile_picture.toString('base64');
                res.status(200).json({ profile_picture: base64Image });
            } else {
                // If the row does not have a profile picture, return a default image
                const defaultImage = fs.readFileSync(path.join(__dirname, 'uploads', 'profiles', 'default_profile_picture.jpg'));
                const base64DefaultImage = defaultImage.toString('base64');
                res.status(200).json({ profile_picture: base64DefaultImage });
            }
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// For profile picture upload with Google sign-in
app.post('/upload-google/:email', upload.single('image'), async (req, res) => {
    try {
        const { email } = req.params;
        const uploadDir = path.join(__dirname, 'uploads', 'profiles');

        // Ensure the 'uploads/profiles' directory exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Get the uploaded file data
        const imageBuffer = req.file.buffer;

        // Use sharp to resize and lower the quality of the image
        const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 300, height: 300 }) // Adjust the dimensions as needed
            .jpeg({ quality: 50 }) // Set the desired quality (0-100)
            .toBuffer();

        // Save the resized file to the specified destination
        const targetPath = path.join(uploadDir, `${email}_profile_picture.jpg`);
        fs.writeFileSync(targetPath, resizedImageBuffer);

        // Update the profile picture in the database
        db.run('UPDATE registered_accounts_with_google SET profile_picture = ? WHERE email = ?;', [resizedImageBuffer, email], (err) => {
            if (err) {
                console.error('Error updating Google profile picture in the database:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                // Send a success message upon successful upload
                res.status(200).json({ message: 'Google Profile picture uploaded successfully' });
            }
        });
    } catch (error) {
        console.error('Error uploading Google profile picture:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// For profile picture retrieval with Google sign-in
app.get('/get_profile_picture_google/:email', async (req, res) => {
    const { email } = req.params;

    try {
        // Check if the email exists in the database and has a profile picture
        db.get('SELECT profile_picture FROM registered_accounts_with_google WHERE email = ?;', [email], (err, row) => {
            if (err) {
                return res.status(500).json({ error: 'Error fetching Google profile picture' });
            }

            // If the row exists and has a profile picture, send the image data
            if (row && row.profile_picture) {
                const base64Image = row.profile_picture.toString('base64');
                res.status(200).json({ profile_picture: base64Image });
            } else {
                // If the row does not have a profile picture, return a default image
                const defaultImage = fs.readFileSync(path.join(__dirname, 'uploads', 'profiles', 'default_profile_picture.jpg'));
                const base64DefaultImage = defaultImage.toString('base64');
                res.status(200).json({ profile_picture: base64DefaultImage });
            }
        });
    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/scores/:email', async (req, res) => {
    const { email } = req.params;
    const { score } = req.body;

    // Get the user's ID from the registered_accounts table
    db.get('SELECT id FROM registered_accounts WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            res.status(500).json({ error: 'Failed to fetch user ID' });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = row.id;

        // Insert the new score into the scores table
        db.run(
            'INSERT INTO scores (user_id, score) VALUES (?, ?)',
            [userId, score],
            (err) => {
                if (err) {
                    console.error('Error inserting score:', err);
                    res.status(500).json({ error: 'Failed to insert score' });
                } else {
                    res.status(200).json({ message: 'Score added successfully' });
                }
            }
        );
    });
});

app.post('/google-scores/:email', async (req, res) => {
    const { email } = req.params;
    const { score } = req.body;

    // Get the user's ID from the registered_accounts table
    db.get('SELECT id FROM registered_accounts_with_google WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            res.status(500).json({ error: 'Failed to fetch user ID' });
            return;
        }

        if (!row) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = row.id;

        // Insert the new score into the scores table
        db.run(
            'INSERT INTO google_scores (user_id, score) VALUES (?, ?)',
            [userId, score],
            (err) => {
                if (err) {
                    console.error('Error inserting score:', err);
                    res.status(500).json({ error: 'Failed to insert score' });
                } else {
                    res.status(200).json({ message: 'Score added successfully' });
                }
            }
        );
    });
});
// app.get('/top-scores/:email', async (req, res) => {
//     const { email } = req.params;

//     try {
//         const row = await new Promise((resolve, reject) => {
//             db.get('SELECT id FROM registered_accounts WHERE email = ?', [email], (err, row) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(row);
//                 }
//             });
//         });

//         if (!row) {
//             res.status(404).json({ error: 'User not found' });
//             return;
//         }

//         const userId = row.id;

//         // Fetch top 5 scores for the user from the scores table
//         const topScores = await new Promise((resolve, reject) => {
//             db.all('SELECT * FROM scores WHERE user_id = ? ORDER BY score DESC LIMIT 5', userId, (err, rows) => {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     resolve(rows);
//                 }
//             });
//         });

//         res.json({ topScores });
//         console.log('User ID:', userId);
//         console.log('Top Scores:', topScores);
//     } catch (error) {
//         console.error('Error fetching top scores:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

app.get('/top-scores/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const userData = await new Promise((resolve, reject) => {
            db.get('SELECT id, name FROM registered_accounts WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!userData) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = userData.id;
        const userName = userData.name;

        // Fetch top 5 scores for the user from the scores table
        const topScores = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM scores WHERE user_id = ? ORDER BY score DESC LIMIT 5', userId, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        const Scoresdata = topScores.map(score => ({ ...score, userName }));

        res.json(Scoresdata);
        console.log('User ID:', userId);
        console.log('User Name:', userName);
        console.log('Top Scores:', Scoresdata);
    } catch (error) {
        console.error('Error fetching top scores:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/top-scores-google/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const userData = await new Promise((resolve, reject) => {
            db.get('SELECT id, name FROM registered_accounts_with_google WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!userData) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = userData.id;
        const userName = userData.name;

        // Fetch top 5 scores for the user from the scores table
        const topScores = await new Promise((resolve, reject) => {
            db.all('SELECT * FROM google_scores WHERE user_id = ? ORDER BY score DESC LIMIT 5', userId, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
        const Scoresdata = topScores.map(score => ({ ...score, userName }));

        res.json(Scoresdata);
        console.log('User ID:', userId);
        console.log('User Name:', userName);
        console.log('Top Scores:', Scoresdata);
    } catch (error) {
        console.error('Error fetching top scores:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
app.get('/recent-score/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const userData = await new Promise((resolve, reject) => {
            db.get('SELECT id, name FROM registered_accounts WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!userData) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = userData.id;
        const userName = userData.name;

        // Fetch the most recent score for the user from the scores table
        const recentScore = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM scores WHERE user_id = ? ORDER BY id DESC LIMIT 1', userId, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!recentScore) {
            res.status(404).json({ error: 'Scores not found' });;
        } else {
            res.json({ userName, score: recentScore.score });
        }

        console.log('User ID:', userId);
        console.log('User Name:', userName);
        console.log('Recent Score:', recentScore);
    } catch (error) {
        console.error('Error fetching recent score:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/recent-score-google/:email', async (req, res) => {
    const { email } = req.params;

    try {
        const userData = await new Promise((resolve, reject) => {
            db.get('SELECT id, name FROM registered_accounts_with_google WHERE email = ?', [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!userData) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const userId = userData.id;
        const userName = userData.name;

        // Fetch the most recent score for the user from the scores table
        const recentScore = await new Promise((resolve, reject) => {
            db.get('SELECT * FROM google_scores WHERE user_id = ? ORDER BY id DESC LIMIT 1', userId, (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row);
                }
            });
        });

        if (!recentScore) {
            res.status(404).json({ error: 'Scores not found' });;
        } else {
            res.json({ userName, score: recentScore.score });
        }

        console.log('User ID:', userId);
        console.log('User Name:', userName);
        console.log('Recent Score:', recentScore);
    } catch (error) {
        console.error('Error fetching recent score:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/user-age/:email', (req, res) => {
    const { email } = req.params;
    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Fetch user's age from the database
    db.get('SELECT age FROM registered_accounts WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error fetching user age:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if user's age is found
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ age: row.age });
    });
});

app.get('/user-age-google/:email', (req, res) => {
    const { email } = req.params;
    // Check if email is provided
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Fetch user's age from the database
    db.get('SELECT age FROM registered_accounts_with_google WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error fetching user age:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if user's age is found
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ age: row.age });
    });
});

app.post('/update-user-age/:email', (req, res) => {
    const { email } = req.params;
    const { age } = req.body;
    // Check if email and age are provided
    if (!email || !age) {
        return res.status(400).json({ error: 'Email and age are required' });
    }

    // Update user's age in the database
    db.run('UPDATE registered_accounts SET age = ? WHERE email = ?', [age, email], function(err) {
        if (err) {
            console.error('Error updating user age:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if any rows were affected
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User age updated successfully' });
    });
});

app.post('/update-user-age-google/:email', (req, res) => {
    const { email } = req.params;
    const { age } = req.body;
    // Check if email and age are provided
    if (!email || !age) {
        return res.status(400).json({ error: 'Email and age are required' });
    }

    // Update user's age in the database
    db.run('UPDATE registered_accounts_with_google SET age = ? WHERE email = ?', [age, email], function(err) {
        if (err) {
            console.error('Error updating user age:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Check if any rows were affected
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'User age updated successfully' });
    });
});

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to the server!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
