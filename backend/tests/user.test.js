process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('../app');
const db = require('../db');

afterAll(async () => {
    await db.query('DELETE FROM users')
    await db.query('ALTER SEQUENCE users_userid_seq RESTART WITH 1');
    await db.end();
});

let testUser = {
    username: "TestUser",
    password: "Testpassword1!",
    email: "test@test.com",
    first_name: "James",
    last_name: "Logan"
};

describe('POST /users Registrations', () => {
    test('Creates a new user', async () => {
        const res = await request(app).post('/users/register').send(testUser);
        if(res.statusCode === 201){
            testUser._token = res.body._token;
        }else{
            console.log(res.body);
        }
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('_token')
    });

    test('Does not create a user with no password', async() => {
        let noPassUser = {
            username: "TestUser1",
            email: "test1@test.com",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noPassUser);

        expect(res.statusCode).toBe(400);
        expect(res.body.message[0]).toBe('instance requires property "password"');
    });

    test('Does not create a user if password is blank', async() => {
        let noPassUser = {
            username: "TestUser1",
            password: "",
            email: "test1@test.com",
            first_name: "James",
            last_name: "Logan"
        };

        const res = await request(app).post('/users/register').send(noPassUser);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Password field cannot be blank');
    })

    test('Does not create a user with no username', async() => {
        let noUsernameUser = {
            password: "Testpassword1!",
            email: "test2@test.com",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noUsernameUser);

        expect(res.statusCode).toBe(400);
        expect(res.body.message[0]).toBe('instance requires property "username"');
    });

    test('Does not create a user if username field is blank', async() => {
        let noUsernameUser = {
            username: "",
            password: "Testpassword1!",
            email: "test2@test.com",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noUsernameUser);

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe('Username field cannot be blank');
    });

    test('Does not create a user with no email', async() => {
        let noEmailUser = {
            username: "TestUser3",
            password: "Testpassword1!",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noEmailUser);

        expect(res.statusCode).toBe(400);
        expect(res.body.message[0]).toBe('instance requires property "email"');
    });

    test('Does not create a user if username is already in use', async() => {
        let sameUsernameUser = {
            username: "TestUser",
            password: "Testpassword1!",
            email: "test4@test.com",
            first_name: "James",
            last_name: "Logan"
        }
        const res = await request(app).post('/users/register').send(sameUsernameUser);

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("There already exists a user with username 'TestUser")
    });

    test('Does not create a user if email is already in use', async() => {
        let sameEmailUser = {
            username: "TestUser69598",
            password: "Testpassword1!",
            email: "test@test.com",
            first_name: "James",
            last_name: "Logan"
        };

        const res = await request(app).post('/users/register').send(sameEmailUser);

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("This email address is already in use")
    })
});
