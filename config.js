const mysql = require('mysql')
const dotenv = require('dotenv')

dotenv.config({path: './.env'})


const db = mysql.createConnection({
    host:process.env.DATABASE_HOST,
    user:process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database:process.env.DATABASE_NAME,
    timeout: 60000
})

db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("DB is connected");
    }
})
module.exports = db
