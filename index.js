const express= require("express");
const dotenv = require("dotenv");
const hospitalRoutes = require("./routes/hospitalRoutes")
const receiverRoutes = require("./routes/receiverRoutes")
require("./db-connection")
dotenv.config();

const app= express();
app.use(express.json());

app.use("/hospital", hospitalRoutes);
app.use("/receiver", receiverRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT,()=>{
    console.log(`Server Started on Port ${PORT}`);
})