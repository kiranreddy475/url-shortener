const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "ammu@123",
    database: "url_shortener"
});


// ----------------------
// PostgreSQL Connection
// ----------------------

pool.connect()
    .then(client => {
        console.log("PostgreSQL connected successfully");
        client.release();
    })
    .catch(err => {
        console.error("PostgreSQL connection failed:", err);
    });


// ----------------------
// Generate Short Code
// ----------------------

function generateShortCode(length = 6) {

    const characters =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

    let result = "";

    for (let i = 0; i < length; i++) {

        const randomIndex =
            Math.floor(Math.random() * characters.length);

        result += characters[randomIndex];
    }

    return result;
}


// ----------------------
// Create Tables
// ----------------------

async function createTables() {

    try {

        // Users table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        ` );

        // URL table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS url_table (
                id SERIAL PRIMARY KEY,
                short_url TEXT UNIQUE NOT NULL,
                long_url TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Tables ready");

    } catch (error) {

        console.error("Error creating tables:", error);
    }
}

createTables();


// =====================================================
// REGISTER
// =====================================================

app.post("/register", async (req, res) => {

    try {

        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {

            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }


        // Check whether username already exists
        const existingUser = await pool.query(`
            
            SELECT id
            FROM users
            WHERE username = $1
            
            `,[username]
        );


        if (existingUser.rows.length > 0) {

            return res.status(409).json({
                success: false,
                message: "Username already exists"
            });
        }


        // Create user
        const result = await pool.query(`
            
            INSERT INTO users (username, password)
            VALUES ($1, $2)
            RETURNING id, username
            
            `,[username, password]
        );


        return res.status(201).json({

            success: true,

            message: "User registered successfully",

            user: result.rows[0]
        });

    } catch (error) {

        console.error("Registration error:", error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong"
        });
    }
});


// =====================================================
// LOGIN
// =====================================================

app.post("/login", async (req, res) => {

    try {

        const { username, password } = req.body;


        if (!username || !password) {

            return res.status(400).json({

                success: false,

                message: "Username and password are required"
            });
                }
                 // Find user
        const result = await pool.query(`
            
            SELECT id, username, password
            FROM users
            WHERE username = $1
            `,[username]
        );


        // User doesn't exist
        if (result.rows.length === 0) {

            return res.status(401).json({

                success: false,

                message: "Invalid username or password"
            });
        }


        const user = result.rows[0];


        // Check password
        if (password !== user.password) {

            return res.status(401).json({

                success: false,

                message: "Invalid username or password"
            });
        }


        return res.status(200).json({

            success: true,

            message: "Login successful",

            user: {
                id: user.id,
                username: user.username
            }
        });

    } catch (error) {

        console.error("Login error:", error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong"
        });
    }
});


// =====================================================
// CREATE SHORT URL
// =====================================================

app.post("/short", async (req, res) => {

    try {

        const { url } = req.body;

        console.log("Received URL:", url);


        // Validate input
        if (!url) {

            return res.status(400).json({

                success: false,

                message: "url is required"
            });
        }


        // Check whether this URL already exists
        const existingUrl = await pool.query(`
            
            SELECT short_url
            FROM url_table
            WHERE long_url = $1
            
        `, [url]);


        if (existingUrl.rows.length > 0) {

            const shortUrl = existingUrl.rows[0].short_url;

            return res.json({

                success: true,

                message: "URL already exists",

                responseUrl: `http://localhost:3000/${shortUrl}`
            });
        }


        // Generate short code
        let shortUrl;

        while (true) {

            shortUrl = generateShortCode();

            const existingCode = await pool.query(`
                
                SELECT id
                FROM url_table
                WHERE short_url = $1
                
            `, [shortUrl]);


            if (existingCode.rows.length === 0) {
                break;
            }
        }


        // Save URL
        await pool.query(`
            
            INSERT INTO url_table
            (
                short_url,
                long_url
            )
            VALUES ($1, $2)
            
        `, [shortUrl, url]);


        return res.status(201).json({

            success: true,

            message: "URL shortened successfully",

            responseUrl: `http://localhost:3000/${shortUrl}`
        });

    } catch (error) {

        console.error("Short URL error:", error);

        return res.status(500).json({

            success: false,

            message: "Something went wrong"
        });
    }
});


// =====================================================
// REDIRECT SHORT URL
// =====================================================

app.get("/:shortCode", async (req, res) => {

    try {

        const { shortCode } = req.params;
 const result = await pool.query(`
            
            SELECT long_url
            FROM url_table
            WHERE short_url = $1
            
           `, [shortCode]
        );


        if (result.rows.length === 0) {

            return res.status(404).send("Short URL not found");
        }


        const longUrl = result.rows[0].long_url;


        // Redirect
        res.redirect(longUrl);

    } catch (error) {

        console.error("Redirect error:", error);

        res.status(500).json({

            message: "Something went wrong"
        });
    }
});


// =====================================================
// START SERVER
// =====================================================

app.listen(3000, () => {

    console.log("Server running on port 3000");

});