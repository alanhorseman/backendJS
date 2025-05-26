const express = require('express');
const router = express.Router();
const ProductManager = require('../ProductManager');
const manager = new ProductManager('./data/products.json');

// para la ruta /home donde se van a estar los productos estaticos, se deben obtener los productos y pasarlos en el .render
router.get('/home', async (req, res) => {
  const products = await manager.getProducts();
  res.render('home', { products });
});

// para la ruta /realtimeproducts no es necesario obtener y pasar los productos, se encarga socket.io de ponerlos
router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts'); 
});

module.exports = router;
