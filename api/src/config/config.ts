import dotenv from 'dotenv';
dotenv.config();

const config = {
    DB_USER : process.env.DB_USER,
    DB_PASSWORD : process.env.DB_PASSWORD,
    DB_HOST : process.env.DB_HOST,
    DB_PORT : process.env.DB_PORT,
    DB_SERVICE_NAME : process.env.DB_SERVICE_NAME,
}

export default config;

