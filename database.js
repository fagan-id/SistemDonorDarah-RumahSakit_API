const {Client} = require('pg');
require('dotenv').config

// Connect to PostgreSQL
const conn = new Client({
    host : process.env.DB_HOST,
    user : process.env.DB_USER,
    port : process.env.DB_PORT,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_DATABASE_NAME
});

module.exports = { conn };

// OTW GANTI CLIENT -> POOL / Maybe in the future 

//TBA SUPABASE