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


app.post("/find-products", async (req, res) => {
  const { skus_n } = req.body;
  const headers = {
    accept: "application/json",
    authorization: "Bearer d11f82236d18264c45d33fda2857f04c96e14771134529aac94c9fb491b5dbcb",
  };

  let allProducts = [];
  let offset = 0;
  const limit = 100;

  try {
    // Отримання всіх продуктів
    while (true) {
      const response = await axios.get(
        `https://api.webflow.com/v2/sites/66fd1c590193b201914b0d7c/products?offset=${offset}`,
        { headers }
      );

      const products = response.data.items;
      allProducts = allProducts.concat(products);

      if (products.length < limit) break;

      offset += limit;
    }

    // Фільтруємо та отримуємо відповідні продукти
    const matchingProducts = [];
    for (const product of allProducts) {
      const relevantSkus = [];

      for (const sku of product.skus) {
        if (skus_n.includes(sku.fieldData.sku)) {
          // Додатковий запит для отримання кількості продукту
          const inventoryResponse = await axios.get(
            `https://api.webflow.com/v2/collections/66fd1c590193b201914b0dea/items/${sku.id}/inventory`,
            { headers }
          );

          const quantity = inventoryResponse.data.quantity;

          // Формування інформації про SKU
          relevantSkus.push({
            name: sku.fieldData.name,
            slug: sku.fieldData.slug,
            price: sku.fieldData.price.value,
            sku: sku.fieldData.sku,
            id: sku.id,
            product: sku.fieldData.product,
            img: sku.fieldData['main-image'].url,
            quantity: quantity, // Додаємо кількість
          });
        }
      }

      if (relevantSkus.length > 0) {
        matchingProducts.push({
          tag: product.product.fieldData['teg-2'],
          skus: relevantSkus,
        });
      }
    }

    res.json(matchingProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});



app.listen(PORT, () => console.log("Server on " + PORT))
