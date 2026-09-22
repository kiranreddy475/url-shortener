const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app=express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "ammu@123",
    database: "url_shortener"
});

pool.connect()
    .then(client => {
        console.log("PostgreSQL connected successfully");
        client.release();
    })
    .catch(err => {
        console.error("PostgreSQL connection failed:", err);
    });
//---------------
//business logic
//---------------
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
// Create users table
// ----------------------

async function createTable() {
    try {

        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                short_url TEXT,
                long_url TEXT NOT NULL
            );
        `);

        console.log("users table ready");

    } catch (error) {
        console.error("Error creating table:", error);
    }
}

createTable();//runs the code here,calls here


// ----------------------
// Short URL API
// ----------------------

// ----------------------
// Redirect Short URL
// ----------------------

app.post("/short", async (req, res) => {

    try {

        const longUrl = req.body.url;

        console.log("Received URL:", longUrl);

        // 1. Check whether URL already exists
        const existingUrl = await pool.query(
            `
            SELECT short_url
            FROM users
            WHERE long_url = $1
            `,
            [longUrl]
        );

        // 2. If URL already exists
        if (existingUrl.rows.length > 0) {

            const shortUrl = existingUrl.rows[0].short_url;

            return res.json({
                message: "URL already exists",
                responseUrl: `http://localhost:3000/${shortUrl}`
            });
        }

        // 3. URL doesn't exist, generate new short code
        const shortUrl = generateShortCode();

        // 4. Save it
        await pool.query(
            `
            INSERT INTO users (short_url, long_url)
            VALUES ($1, $2)
            `,
            [shortUrl, longUrl]
        );

        // 5. Return new short URL
        res.json({
            message: "URL shortened successfully",
            responseUrl: `http://localhost:3000/${shortUrl}`
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});
app.get("/:shortCode", async (req, res) => {

    try {

        const { shortCode } = req.params;

        console.log("Short code received:", shortCode);

        const result = await pool.query(
            `
            SELECT long_url
            FROM users
            WHERE short_url = $1
            `,
            [shortCode]
        );

        // Short URL doesn't exist
        if (result.rows.length === 0) {
            return res.status(404).send("Short URL not found");
        }

        const longUrl = result.rows[0].long_url;

        // Redirect browser to original URL
        res.redirect(longUrl);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Something went wrong"
        });
    }
});


 
app.listen(3000,()=>{
    console.log("server running on port no 3000")
})