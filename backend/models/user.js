const db = require("../db");
const bcrypt = require("bcrypt")

const BCRYPT_WORK_FACTOR = 10;

class User{
    static async register(data){
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [data.username]
        );

        if(duplicateCheck.rows[0]) {
            const err = new Error(
                `There already exists a user with username '${data.username}`
            );
            err.status = 409;
            throw err;
        }

        const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `
            INSERT INTO users
                (username, password, first_name, last_name, email)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, first_name, last_name, email
            `,
            [
                data.username,
                hashedPassword,
                data.first_name,
                data.last_name,
                data.email
            ]
        );

        return result.rows;
    };
};

module.exports = User;