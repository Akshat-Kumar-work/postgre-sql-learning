import { Client } from "pg";

const client = new Client({
    connectionString:"postgresql://postgres:CoderData6@localhost/postgres"
})

//function to create user table
async function createUsersTable(){

   try{
    await client.connect();

    const result = await client.query(`
    CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );`)
    console.log("table created success",result);
    return "ok";
   }
   catch(err){
    console.log("err while creating table",err);
   }finally{
  await  client.end();
   }
    
}

//common way to insert data but this way cannot prevent the sql injections 
async function insertData (){
   try{
    await client.connect();
    const query = "INSERT INTO users (username , email ,password) VALUES ('himanshi','yes@gmail.com','wowwow') ";
    const result = await client.query(query);
    console.log("insert user data ",result);
   }
   catch(err){
    console.log("error while inserting data",err);
   }finally{
    await client.end();
   }
}

//more secure way to insert data it can prevent sql injections
async function  moreSecureWayToInsertData () {
    try{
    await client.connect();
    const insertQuery = "INSERT INTO users(username , email, password) VALUES($1,$2,$3)";
    const values:(string|Number)[] = [ "avnish","avnish@gmail.com",35532];
    const result  =  await client.query(insertQuery,values);
    console.log("more secure way to insert data ",result);

    }catch(err){
        console.log("err in more secure insert data func",err);
    }finally{
        await  client.end();

    }
}


//function to fetch data as email as input
async function  getuserData(name:string) {
try{
    await client.connect();
    const query = 'SELECT * FROM users WHERE username=$1';
    const nameInput:string[] = [name];
    const result =  await client.query(query,nameInput);
    if(result.rows.length>0){
        console.log("user found",result.rows[0]);
    }
    else{
        console.log("user not found sorry");
    }
}catch(err){
    console.log("err while fetching user data",err);
}finally{
    await  client.end();

}
}

//relationships -> using foreign key
async function addressTable() {
    try{
        await client.connect();
        const result = await client.query(`
            CREATE TABLE addresses (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            pincode INTEGER,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );`)
        console.log("address table created ",result)
    }
    catch(err){
        console.log("error while creating address table",err)
    }
    finally{
        await  client.end();

    }
}

async function insertAddress(user_id:Number, city:string, country:string,pincode:Number) {
    try{
        await client.connect();
        const query = 'INSERT INTO addresses (user_id,city,country,pincode) VALUES($1,$2,$3,$4)';
        const values = [user_id,city,country,pincode];
        const result =  await client.query(query,values);
        console.log("data inserted in addresss ",result);
    }
    catch(err){
        console.log("error while inserting address",err);
    }
    finally{
        await  client.end();
    }
}

// insertAddress(3,"sultanpuri","INDIA",45234);


//Joins
//used to join the 2 tables having some relation between them
//if we have to fetch the user data and its address
//approach 1, we can fetch it by SELECT QUERY one by one but by using joins we can fetch them in single query

async function  fetchUserDataWithAddress (userId:Number){
    try{
        await client.connect();
        const query:string = `SELECT users.username, users.email, addresses.city, addresses.country, addresses.pincode FROM users LEFT JOIN addresses
         ON users.id = addresses.user_id WHERE users.id=$1;` 
        const value:Number[] = [userId];
        const result = await client.query(query,value);
        if(result.rows.length>0){
            console.log("data found",result.rows);
        }
        else{
            console.log("data not found");
        }
    }
    catch(err){
        console.log("error while fetching user data with address",err);
    }
    finally{
        await  client.end();

    }
}

fetchUserDataWithAddress(3);


