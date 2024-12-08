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

const axios = require('axios');

app.post("/find-products", (req, res) => {
  const { skus_n } = req.body; // отримуємо SKUs з тіла запиту
  const options = {
    method: 'GET',
    url: 'https://api.webflow.com/v2/sites/66fd1c590193b201914b0d7c/products',
    headers: {
      accept: 'application/json',
      authorization: 'Bearer d11f82236d18264c45d33fda2857f04c96e14771134529aac94c9fb491b5dbcb',
    }
  };

  axios
    .request(options)
    .then(function (response) {
      const allProducts = response.data.items;
      const matchingProducts = allProducts.filter((product) => 
        product.skus.some((sku) => skus_n.includes(sku.fieldData.sku))
      );
      res.json(matchingProducts);
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error." });
    });
});


app.listen(PORT, () => console.log("Server on " + PORT))
