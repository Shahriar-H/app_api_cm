const express = require('express');
const db = require('./config')
const cors = require('cors')

const app = express();
app.use(express.json())
app.use(cors())



const FindDuplicate = (email)=>{
    return new Promise(async function(resolve, reject) {
        const SelectEmailifExist = "SELECT * FROM user WHERE email=?";
        db.query(SelectEmailifExist,[email],async (error,results,fields)=>{
            if (error) {
                reject(error);
            }
            
            
            const contentL = await results?.length;
            if(contentL){
                resolve(contentL);
            }else{
                reject(0)
            }
                
            
            // console.log(contentL);
            
        })
    });
}

app.post('/signup',async (req,res)=>{
    const sql = "INSERT INTO user SET ? ";
    const data = req.body;
    
    FindDuplicate(data?.email).then((totalAllreadyUser)=>{
        if(totalAllreadyUser>0){
            res.send({status:400,message:"Email already stored"})
        }
        else{
            res.send({status:500,message:"Server Error"})
        }
        
    })
    .catch((err)=>{
        if(err===0){//0 means the email is unique
            db.query(sql,data,(err,result,fields)=>{
                if (err) {
                    res.send("Error: "+err);
                    console.log(err)
                    return 0;
                }
                res.send({status:200,message:"Insert successful",result:result})
            
            })
        }
        // res.send(err)
    })
    
    
})

app.post('/login',(req,res)=>{
    try{
        const data = req?.body;
        console.log(data?.email)

        const SelectEmailifExist = "SELECT * FROM user WHERE email=? AND password=? LIMIT 1";
        db.query(SelectEmailifExist,[data?.email,data?.password],(error,results,fields)=>{
            if (error) {
                reject(error);
            }
            
            
            const contentL = results?.length;
            if(contentL){
                const resultsPub={
                    name:results[0]?.name,
                    email:results[0]?.email,
                    phone:results[0]?.phone,
                    id:results[0]?.id
                }
               
                res.send({status:200,message:"login success", result:resultsPub})
            }else{
                res.send({status:404,message:"login failed", result:results})
            }
            
        })
    }catch{
        res.send({status:404,message:"login Error", result:results})
    }
    
})


app.delete("/delete-user/:id",(req,res)=>{
    const id = req?.params.id;
    const sql = "DELETE FROM user WHERE id="+id;
    

    db.query(sql,(err,result)=>{
        if(err){
            res.send({status:500,message:"Delete Failed"})
            return 0;
        }
        res.send({status:200,message:"Delete Successful"})
    })

})

app.post("/addexpence",(req,res)=>{
    const data = req?.body;
    const sql = "INSERT INTO expences SET ?";
    db.query(sql,data,(err,results,fields)=>{
        if(err){
            res.send({status:404,message:"Failed to upload"})
            console.log(err);
            return 0;
        }
        res.send({status:200,message:"upload success",result:results})
    })
})

app.delete("/delete-expence/:id",(req,res)=>{
    const id = req?.params.id;
    const sql = "DELETE FROM expences WHERE id="+id;
    

    db.query(sql,(err,result)=>{
        if(err){
            res.send({status:500,message:"Delete Failed"})
            return 0;
        }
        res.send({status:200,message:"Delete Successful"})
    })

})

app.get("/users",(req,res)=>{
    const sql = "SELECT * FROM user";
    db.query(sql,(err,results)=>{
        if(err){
            res.send({status:404,message:"Data fetching failed"});
            return 0;
        }
        res.send({status:200,message:"Data fetched",results:results});
    })
})
app.get("/expences",(req,res)=>{
    const sql = "SELECT * FROM expences";
    db.query(sql,(err,results)=>{
        if(err){
            res.send({status:404,message:"Data fetching failed"});
            return 0;
        }
        res.send({status:200,message:"Data fetched",results:results});
    })
})
app.get("/records",(req,res)=>{
    const sql = "SELECT * FROM money";
    db.query(sql,(err,results)=>{
        if(err){
            res.send({status:404,message:"Data fetching failed"});
            return 0;
        }
        res.send({status:200,message:"Data fetched",results:results});
    })
})

app.post("/addmoney",(req,res)=>{
    const data = req?.body;
    const sql = "INSERT INTO money SET ?";
    db.query(sql,data,(err,results,fields)=>{
        if(err){
            res.send({status:404,message:"Failed to upload"})
            console.log(err);
            return 0;
        }
        res.send({status:200,message:"Add success",result:results})
    })
})

app.delete("/delete-addedmoney/:id",(req,res)=>{
    const id = req?.params.id;
    const sql = "DELETE FROM money WHERE id="+id;
    

    db.query(sql,(err,result)=>{
        if(err){
            res.send({status:500,message:"Delete Failed"})
            return 0;
        }
        res.send({status:200,message:"Delete Successful"})
    })

})




app.listen(5000,()=>{
    console.log("Server Started at 5000");
})