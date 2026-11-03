import pg from 'pg'
import 'dotenv/config'

const { Pool } = pg;

export const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    database: process.env.DB_NAME || 'music_app'
})

export const query = (text, params) => {
    return pool.query(text, params)
}