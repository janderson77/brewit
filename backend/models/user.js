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
            RETURNING userid, username, first_name, last_name, email
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

    static async authenticate(data) {
        const findUserResults = await db.query(
            `
            SELECT userid,
                    username,
                    password,
                    first_name,
                    last_name,
                    email,
                    profileimgurl
            FROM users
            WHERE email = $1
            `,
            [data.email]
        );

        const user = findUserResults.rows[0];

        if(user){
            const isCorrectPassword = await bcrypt.compare(data.password, user.password);
            if(isCorrectPassword) {
                delete user.password;

                // Add function to get user brews
                // Add function to get user reviews
                // Add function to get user saved recipes

                return user;
            };
        };

        const invalidPassword = new Error("Invalid Credentials");
        invalidPassword.status = 401;
        throw invalidPassword
    };
};

module.exports = User;