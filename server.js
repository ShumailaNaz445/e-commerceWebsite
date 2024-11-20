const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const route = require('./route/router');
const productRoute  = require('./route/productroute')
const cors = require('cors');
const path = require('path');

require('dotenv').config();
app.use(bodyParser.json())

mongoose.connect(process.env.db_url).then(() => {
    console.log('connect');
}).catch(() => {
    console.log("not connect");
    
})

app.use(express.static(path.resolve(path.join(__dirname, 'public'))))
app.use(bodyParser.json())
app.use(cors())
app.use(route);

app.use(productRoute)

app.listen(3000, () => {
    console.log("app is running...");

})
