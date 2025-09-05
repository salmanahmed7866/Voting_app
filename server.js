const express = require('express');
const app = express();
const db = require('./db.js');
const bodyParser = require('body-parser');
const userRoutes=require("./routes/user_routes.js");
const candidateRoutes=require("./routes/candidate_routes.js")
app.use(bodyParser.json());
require('dotenv').config()

app.get('/', (req, res) => {
    res.send('Helo World')
})

app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);
app.listen(3000, () => {
    console.log("App is Running");
})