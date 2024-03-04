import { Client } from "pg";

const client = new Client({
    connectionString:"postgresql://postgres:CoderData6@localhost/postgres"
})


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
    client.end();
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
        client.end();
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
    client.end();
}
}


    getuserData("wow");
