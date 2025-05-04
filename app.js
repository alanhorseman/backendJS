const express = require("express");
const productsRouter = require("./src/routes/products.router")
const cartsRouter = require("./src/routes/carts.router");

const app = express();
const PORT = 8080;

app.use(express.json());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})