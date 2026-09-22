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

app.post("/short", async (req, res) => {

    try {

        const longUrl = req.body.url;

        console.log("Received URL:", longUrl);

        // Temporary short URL
        const shortUrl = generateShortCode()

        const result = await pool.query(
            `
            INSERT INTO users (short_url, long_url)
            VALUES ($1, $2)
            RETURNING *
            `,
            [shortUrl, longUrl]
        );

        res.json({
            message: "URL received successfully",
            data: result.rows[0]
        });

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