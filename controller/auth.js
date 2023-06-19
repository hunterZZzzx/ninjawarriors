
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var md5 = require('md5');
// const bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
const { application } = require('express');


const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
exports.login = (req,res)=>{
   
    const {username , password } = req.body;
    const validPass = md5(password)
    db.query('SELECT * FROM users WHERE username = ? AND password = ?',[username,validPass],(error,results)=>{
        if(results.length > 0){
          res.render('welcome');
            

        }else{
            res.send('Error Password or Username');
            
        }
        // res.end();
    })
}



exports.register = (req,res)=>{
    console.log(req.body);
    
    const {username ,email , password} = req.body;
   
    db.query('SELECT email FROM USERS WHERE email = ? ',[email],async (error,results)=>{
        if(error){
            console.log(error)
        }
        if(results.length > 0){
            return res.render('register',{
                message:'The Email is already in use'
            })
            
        }
       
            
         
        let hashedpassword = await bcrypt.hash(password, 8);
        console.log(hashedpassword);
        const hashtoken = md5(password);
        

    db.query('INSERT INTO USERS SET ?',{username: username, email: email, password: hashtoken},(error,results)=>{
        if(error){
            console.log(error);
        }else{
            console.log(results);
            return res.render('register',{
                    message:'user Registered'
                })
                
            }
        })

      
    });
}
