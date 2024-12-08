// import { WebflowClient } from "webflow-api";
import express from "express";
import axios from "axios";
const PORT = process.env.PORT || 5500;
const app = express();

//const client = new WebflowClient({
//  accessToken: "f4527fb9661b133b54c7105287522dfd5dd3bb2dc66204ed76bc709a4b081ead",
//});
//const siteID = '66fd1c590193b201914b0d7c';

app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  })
);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "https://www.gadgetar.com.ua");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, PATCH");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    next();
  });








app.listen(PORT, () => console.log("Server on " + PORT))
