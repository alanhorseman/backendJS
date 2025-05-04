const express = require('express');
const path = require('path');
const CartManager = require('../CartManager');
const router = express.Router();

const manager = new CartManager(path.join(__dirname, '../../data/carts.json'));




router.post('/', async (req, res) => {
  const cart = await manager.createCart()
  res.json(cart);
})

router.get('/:cid', async(req, res) => {
  const cart = await manager.getCartById(req.params.cid);
  if(!cart) return res.status(404).json({error: "No se encontro carrito"});
  res.json(cart);
})

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    await manager.addProductToCart(req.params.cid, req.params.pid);
    res.json({message: "Producto agregado"});
  } catch (error) {
    res.status(404).json({error: error.message});
  }
})

module.exports = router;