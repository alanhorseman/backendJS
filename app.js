const express = require("express");
const ProductManager = require("./src/productmanager");

const app = express();
const PORT = 8080;

const manager = new ProductManager("./products.json");

app.use(express.json());

app.get("/products", async (req, res) => {
  const products = await manager.getProducts();
  res.json(products);
})

app.get("/products/:pid", async (req,res) => {
  const productID = await manager.getProductById(req.params.pid);
  if(!productID){
    return res.status(404).json({error: "No se encontro producto"})
  }
  res.json(productID);
})

app.post("/products", async (req, res) => {
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json({newProduct});
  } catch (error) {
    res.status(400).json({error: "no se pudo agregar producto"});
  }
})

app.put("/products/:pid", async (req, res) => {
    const newData = await manager.updateProduct(req.params.pid, req.body);
    if (!newData) return res.status(404).json({error: "No fue posible actualizar el producto"})
    res.json({newData});
})

app.delete("/products/:pid", async (req, res) => {
  const deleted = await manager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({error: "No fue posible eliminar el producto"});
  res.json({message: "Producto eliminado"})
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})