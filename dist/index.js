"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const client = new pg_1.Client({
    connectionString: "postgresql://postgres:CoderData6@localhost/postgres"
});
//function to create user table
function createUsersTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const result = yield client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`);
            console.log("table created success", result);
            return "ok";
        }
        catch (err) {
            console.log("err while creating table", err);
        }
        finally {
            yield client.end();
        }
    });
}
//common way to insert data but this way cannot prevent the sql injections 
function insertData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const query = "INSERT INTO users (username , email ,password) VALUES ('himanshi','yes@gmail.com','wowwow') ";
            const result = yield client.query(query);
            console.log("insert user data ", result);
        }
        catch (err) {
            console.log("error while inserting data", err);
        }
        finally {
            yield client.end();
        }
    });
}
//more secure way to insert data it can prevent sql injections
function moreSecureWayToInsertData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const insertQuery = "INSERT INTO users(username , email, password) VALUES($1,$2,$3)";
            const values = ["avnish", "avnish@gmail.com", 35532];
            const result = yield client.query(insertQuery, values);
            console.log("more secure way to insert data ", result);
        }
        catch (err) {
            console.log("err in more secure insert data func", err);
        }
        finally {
            yield client.end();
        }
    });
}
//function to fetch data as email as input
function getuserData(name) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const query = 'SELECT * FROM users WHERE username=$1';
            const nameInput = [name];
            const result = yield client.query(query, nameInput);
            if (result.rows.length > 0) {
                console.log("user found", result.rows[0]);
            }
            else {
                console.log("user not found sorry");
            }
        }
        catch (err) {
            console.log("err while fetching user data", err);
        }
        finally {
            yield client.end();
        }
    });
}
//relationships -> using foreign key
function addressTable() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const result = yield client.query(`
            CREATE TABLE addresses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            pincode INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`);
            console.log("address table created ", result);
        }
        catch (err) {
            console.log("error while creating address table", err);
        }
        finally {
            yield client.end();
        }
    });
}
function insertAddress(user_id, city, country, pincode) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const query = 'INSERT INTO addresses (user_id,city,country,pincode) VALUES($1,$2,$3,$4)';
            const values = [user_id, city, country, pincode];
            const result = yield client.query(query, values);
            console.log("data inserted in addresss ", result);
        }
        catch (err) {
            console.log("error while inserting address", err);
        }
        finally {
            yield client.end();
        }
    });
}
// insertAddress(3,"sultanpuri","INDIA",45234);
//Joins
//used to join the 2 tables having some relation between them
//if we have to fetch the user data and its address
//approach 1, we can fetch it by SELECT QUERY one by one but by using joins we can fetch them in single query
function fetchUserDataWithAddress(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            const query = `SELECT users.username, users.email, addresses.city, addresses.country, addresses.pincode FROM users LEFT JOIN addresses
         ON users.id = addresses.user_id WHERE users.id=$1;`;
            const value = [userId];
            const result = yield client.query(query, value);
            if (result.rows.length > 0) {
                console.log("data found", result.rows);
            }
            else {
                console.log("data not found");
            }
        }
        catch (err) {
            console.log("error while fetching user data with address", err);
        }
        finally {
            yield client.end();
        }
    });
}
fetchUserDataWithAddress(3);
