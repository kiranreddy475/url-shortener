const express = require("express");
const cors = require("cors");

const app=express();

app.use(cors());
app.use(express.json());

app.post("/short",(req,res)=>{
    const longUrl=req.body.url;

    console.log("Recevied url:",longUrl)

    res.json({
        message:"URL recevied sucessfully"
    })
})


app.listen(3000,()=>{
    console.log("server running on port no 3000")
})