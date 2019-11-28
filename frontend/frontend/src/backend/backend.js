const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require('morgan');

const profilesController = require("./controllers/profile");

const mongoUrl = "mongodb+srv://fullstack:df478444@cluster0-vgh1b.mongodb.net/test?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));

app.use("/api/profile", profilesController);




//TODO: /profile/
//TODO: /image/
//TODO: /my-profile/
//TODO: /publish/
//TODO: /start_order/
//TODO: /cancel_order/
//TODO: /orders/
//TODO: /order_complete/
//TODO: /promocodes/
//TODO: /promocode/
//TODO: /promocode_validate/

//TODO: Error handlers


const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});