const express = require('express');
const path = require('path')
const ProductManager = require('../ProductManager');
const router = express.Router();

const manager = new ProductManager(path.join(__dirname, '../../data/products.json'));

router.get("/", async (req, res) => {
  // Me da los productos
  const products = await manager.getProducts();
  res.json(products);
})

router.get("/:pid", async (req,res) => {
  // Me da productos por su ID
  const productID = await manager.getProductById(req.params.pid);
  if(!productID){
    return res.status(404).json({error: "No se encontro producto"})
  }
  res.json(productID);
})

router.post("/", async (req, res) => {
  // Try-catch para intentar agregar un producto
  try {
    const newProduct = await manager.addProduct(req.body);
    res.status(201).json({newProduct});
  } catch (error) {
    res.status(400).json({error: "no se pudo agregar producto"});
  }
})

router.put("/:pid", async (req, res) => {
  // Actualizamos producto por su ID enviado por params
    const newData = await manager.updateProduct(req.params.pid, req.body);
    if (!newData) return res.status(404).json({error: "No fue posible actualizar el producto"})
    res.json({newData});
})

router.delete("/:pid", async (req, res) => {
  // Eliminamos un producto por su ID enviado tambien por params
  const deleted = await manager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({error: "No fue posible eliminar el producto"});
  res.json({message: "Producto eliminado"})
})

module.exports = router;