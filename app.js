const express=require('express');
const jwt=require('jsonwebtoken');
const bodyparser=require('body-parser');
const app=express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
const datas=require("./data.json");
app.post("/login",(req,res)=>{
    const data=datas.find((dt)=>dt.name===req.body.name);
    if(data){
        if(data.password===req.body.password){
            const token=jwt.sign({Id:data.id},"secret");
            res.status(200).send({token:token});
        }
        else{
            res.status(401).send({message:"wrong password"});
        }
    }
    else{
        res.status(401).send({message:"wrong name"});
    }
});
function checktoken(req,res,next){
    const token=req.headers["authorization"];
    if(token){
        jwt.verify(token,"secret",(err,decoded)=>{
            if(err){
                res.status(401).send({message:"accessdenied"});
                return;
            }
            else{
                req.Id=decoded.Id
                next(); 
            }
        })
    }
    else{
        res.status(401).send({message:"accessdenied"});
    }
}

app.get('/data',checktoken,(req,res)=>{
res.status(200).send("succesfully logged in")

})

app.listen(3300,()=>{
    console.log("port running at 3300");
})