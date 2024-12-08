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
  const limit = 100; // Максимальна кількість елементів у запиті

  try {
    while (true) {
      const response = await axios.get(
        `https://api.webflow.com/v2/sites/66fd1c590193b201914b0d7c/products?offset=${offset}`,
        { headers }
      );

      const products = response.data.items;
      allProducts = allProducts.concat(products);

      // Якщо повернута кількість продуктів менше `limit`, це означає, що ми отримали всі елементи
      if (products.length < limit) break;

      offset += limit;
    }

    // Фільтрація продуктів за SKU
    const matchingProducts = allProducts
      .filter((product) =>
        product.skus.some((sku) => skus_n.includes(sku.fieldData.sku))
      )
      .map((product) => {
        const relevantSkus = product.skus
          .filter((sku) => skus_n.includes(sku.fieldData.sku))
          .map((sku) => ({
            name: sku.fieldData.name,
            slug: sku.fieldData.slug,
            price: sku.fieldData.price.value,
            sku: sku.fieldData.sku,
            id: sku.id,
            product: sku.fieldData.product,
            img: sku.fieldData['main-image'].url,
          }));

        // Додаємо тег до результату для кожного продукту
        const teg2 = product.product;

          
          
          
          // product.fieldData['teg-2'];  // Отримуємо тег із продукту

        // Повертаємо відповідний результат разом із тегом
        return {
          teg2: teg2, // додаємо тег
          skus: relevantSkus // додаємо відфільтровані SKU
        };
      });

    res.json(matchingProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});




app.listen(PORT, () => console.log("Server on " + PORT))
