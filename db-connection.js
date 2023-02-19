var mongoose=require("mongoose");

mongoose.connect("mongodb://localhost:27017/bloodbank").then(()=>{
    console.log("Database Connected Successfully");
}).catch((err)=>{
    console.log("No Connection to Database");
})