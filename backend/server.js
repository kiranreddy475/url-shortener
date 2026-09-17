const { Client, Pool } = require("pg");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// PostgreSQL configuration
const dbConfig = {
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "ammu@123"
};


// ========================================
// 1. Create database and table
// ========================================

async function setupDatabase() {

    // Connect to default PostgreSQL database
    const client = new Client({
        ...dbConfig,
        database: "postgres"
    });

    await client.connect();

    console.log("Connected to PostgreSQL");


    // Check whether "app" database exists
    const result = await client.query(`
        SELECT 1
        FROM pg_database
        WHERE datname = 'app'
    `);


    // Create database if it doesn't exist
    if (result.rowCount === 0) {

        await client.query(`
            CREATE DATABASE app
        `);

        console.log("Database 'app' created");

    } else {

        console.log("Database 'app' already exists");

    }


    await client.end();


    // ========================================
    // Connect to "app" database
    // ========================================

    const appClient = new Client({
        ...dbConfig,
        database: "app"
    });

    await appClient.connect();

    console.log("Connected to app database");


    // Create users table
    await appClient.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            short_url VARCHAR(20) UNIQUE NOT NULL,
            long_url TEXT NOT NULL
        )
    `);

    console.log("Users table ready");


    await appClient.end();
}


// ========================================
// 2. PostgreSQL connection pool
// ========================================

const pool = new Pool({
    ...dbConfig,
    database: "app"
});


// ========================================
// 3. POST /short
// ========================================

app.post("/short", async function (req, res) {

    try {

        const longUrl = req.body.url;

        console.log("Received URL:", longUrl);


        // For now, store the same URL
        // in both short_url and long_url
        const result = await pool.query(
            `
            INSERT INTO users (short_url, long_url)
            VALUES ($1, $2)
            RETURNING *
            `,
            [longUrl, longUrl]
        );


        console.log("Inserted data:", result.rows[0]);


        res.status(201).json({
            message: "URL received successfully",
            data: result.rows[0]
        });


    } catch (error) {

        console.error("Database error:", error);


        res.status(500).json({
            message: "Failed to save URL"
        });

    }

});


// ========================================
// 4. GET /users
// ========================================

app.get("/users", async function (req, res) {

    try {

        const result = await pool.query(`
            SELECT *
            FROM users
            ORDER BY id
        `);


        res.json(result.rows);


    } catch (error) {

        console.error("Database error:", error);


        res.status(500).json({
            message: "Failed to fetch users"
        });

    }

});


// ========================================
// 5. Start server only after DB setup
// ========================================

async function startServer() {

    try {

        await setupDatabase();

        app.listen(9000, function () {

            console.log("Server running on port 9000");

        });

    } catch (error) {

        console.error("Failed to start server:", error);

    }

}


startServer();