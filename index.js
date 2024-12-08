import express from "express";
import axios from "axios";
const PORT = process.env.PORT || 5500;
const app = express();

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

app.post('/', (req, res) => {
    const data = req.body;
    if (data && data.message === 'перевірка') {
        res.json({ status: 'success', message: 'Дані перевірені!' });
    } else {
        res.status(400).json({ status: 'error', message: 'Невірні дані!' });
    }
});


app.listen(PORT, () => console.log("Server on " + PORT))
