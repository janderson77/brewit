process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require("../models/user");
const { DB_URI } = require('../config');

mongoose.connect(DB_URI);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

beforeAll(async () => {
    await User.deleteMany({});
});

afterAll(async () => {
    await User.deleteMany({});
});

let testUser = {
    username: "TestUser",
    password: "Testpassword1!",
    email: "test@test.com",
    first_name: "James",
    last_name: "Logan"
};

describe('POST /users Registration', () => {
    test('Creates a new user', async () => {
        const res = await request(app).post('/users/register').send(testUser);
        if(res.statusCode === 201){
            testUser.token = res.body.token;
        }else{
            console.log(res.body);
        }
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token')
    });

    test('Does not create a user with no password', async() => {
        let noPassUser = {
            username: "TestUser1",
            email: "test1@test.com",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noPassUser);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('No password was given');
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

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('No password was given');
    })

    test('Does not create a user if no username', async() => {
        let noUsernameUser = {
            password: "Testpassword1!",
            email: "test2@test.com",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noUsernameUser);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('No username was given');
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

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('No username was given');
    });

    test('Does not create a user with no email', async() => {
        let noEmailUser = {
            username: "TestUser3",
            password: "Testpassword1!",
            first_name: "James",
            last_name: "Logan"
        };
        const res = await request(app).post('/users/register').send(noEmailUser);

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe('User validation failed: email: Please enter an email address.');
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

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("A user with the given username is already registered");
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

        expect(res.statusCode).toBe(500);
        expect(res.body.message).toBe("This email is already in use");
    });

    // test('Does not create a user if username exceeds max length of 20', async() => {
    //     let tooLongUser = {
    //         username: "TestUser6959856465651616548489465168991",
    //         password: "Testpassword1!",
    //         email: "test5@test.com",
    //         first_name: "James",
    //         last_name: "Logan"
    //     };

    //     let justOver20User = {
    //         username: "TestUser1234567891234",
    //         password: "Testpassword1!",
    //         email: "test6@test.com",
    //         first_name: "James",
    //         last_name: "Logan"
    //     };

    //     const res = await request(app).post('/users/register').send(tooLongUser);
    //     const res2 = await request(app).post('/users/register').send(justOver20User);

    //     expect(res.statusCode).toBe(400);
    //     expect(res.body.message).toBe("Username cannot exceed 20 characters");
    //     expect(res2.statusCode).toBe(400);
    //     expect(res2.body.message).toBe("Username cannot exceed 20 characters");
    // });

    // test('Does create a user if username matches max character length of 20', async() => {
    //     let justRightUser = {
    //         username: "TestUser123456789123",
    //         password: "Testpassword1!",
    //         email: "test7@test.com",
    //         first_name: "James",
    //         last_name: "Logan"
    //     };

    //     const res = await request(app).post('/users/register').send(justRightUser);

    //     expect(res.statusCode).toBe(201);
    // });
});

describe('POST /users Authentication', () => {
    test('Logs in a user', async () => {
        const res = await request(app).post('/users/login').send({username: testUser.username, password: testUser.password});

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body).not.toHaveProperty('password');
    });

    test('Does not log in a user with no email address', async () => {
        const res = await request(app).post('/users/login').send({password: testUser.password});

        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).toBe(400);
        expect(res.body).not.toHaveProperty('token');
    });

    test('Does not log in a user with no password', async () => {
        const res = await request(app).post('/users/login').send({username: testUser.username});

        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).toBe(400);
        expect(res.body).not.toHaveProperty('token');
    });

    test('Does not log in a user with no email address or password', async () => {
        const res = await request(app).post('/users/login').send({});

        expect(res.statusCode).not.toBe(200);
        expect(res.statusCode).toBe(400);
        expect(res.body).not.toHaveProperty('token');
    });

    test('Does not log in user with incorrect password', async () => {
        const res = await request(app).post('/users/login').send({username: testUser.username, password: 'thisiswrong'});
        
        expect(res.statusCode).not.toBe(200);
        expect(res.body).not.toHaveProperty('token');
        expect(res.body).not.toHaveProperty('password');
        expect(res.statusCode).toBe(401);
    });

    test('Does not log in user with incorrect username', async () => {
        const res = await request(app).post('/users/login').send({username: "IamWrong", password: testUser.password});

        expect(res.statusCode).not.toBe(200);
        expect(res.body).not.toHaveProperty('token');
        expect(res.body).not.toHaveProperty('password');
        expect(res.statusCode).toBe(401);
    });

    test('Does not log in user with incorrect username and password', async () => {
        const res = await request(app).post('/users/login').send({username: "IamWrong", password: 'thisiswrong'});

        expect(res.statusCode).not.toBe(200);
        expect(res.body).not.toHaveProperty('token');
        expect(res.body).not.toHaveProperty('password');
        expect(res.statusCode).toBe(401);
    });
});
