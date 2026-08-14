const express = require("express")
 const cors = require("cors")

 const app = express()
 app.use(cors())
 app.use(express.json())

app.post("/short",function(req,res){
    const trail= req.body.url
    res.json({message:"url recieved successfully"}) 
    console.log(trail)
})



 app.listen(9000,function(){console.log("server run, trust me")})
 


