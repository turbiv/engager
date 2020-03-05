const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require("mongoose");
const morgan = require('morgan');
const middleware = require("./utils/middleware");

const profilesController = require("./controllers/my-profile");
const imageupload = require("./controllers/image-upload");
const baseurl = "/backend/engager-backend/api";
const mongoUrl = "mongodb+srv://fullstack:df478444@cluster0-vgh1b.mongodb.net/engager?retryWrites=true&w=majority";
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("tiny"));
app.use(middleware.getToken);

app.use(baseurl + "/my-profile", profilesController);
app.use(baseurl + "/image-upload", imageupload);




//TODO: /profile/
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
app.use(middleware.errorHandler);


const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});