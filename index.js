// import { WebflowClient } from "webflow-api";
import express from "express";
import axios from "axios";
const PORT = process.env.PORT || 5500;
const app = express();

// const client = new WebflowClient({
// accessToken: "d11f82236d18264c45d33fda2857f04c96e14771134529aac94c9fb491b5dbcb",
// });
// const siteID = '66fd1c590193b201914b0d7c';

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

app.post("/find-products", (req, res) => {
  const { skus } = req.body;
 // if (!Array.isArray(skus)) {
   // return res.status(400).json({ error: "Invalid data format. 'skus' must be an array." });
 // }

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
      const matchingProducts = allProducts.filter((product) => {
        const productSkus = product.skus.map(sku => sku.sku);
        return skus.some(sku => productSkus.includes(sku));
      });
      const responseData = matchingProducts.map((product) => ({
        name: product.fieldData.name,
        slug: product.slug,
      }));
      res.json(responseData);
    })
    .catch(function (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Internal server error." });
    });
});

app.listen(PORT, () => console.log("Server on " + PORT))
