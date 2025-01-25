const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const routes = require("../routes/routes");
const db = process.env.MONGO_URI;

mongoose.connect(db).then(()=>{
    console.log('MongoDB connected');
}).catch((err)=>{
    console.log(err);
})

const app = express();
const PORT = 8000;

app.use(express.json());

// Middleware to parse URL-encoded request bodies (optional, if needed)
app.use(express.urlencoded({ extended: true }));


app.use("/api",routes);

app.get('/',(req,res)=>{
    res.send('Server is running');
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});