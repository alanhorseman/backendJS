const express = require('express');
const path = require('path');
const CartManager = require('../CartManager');
const router = express.Router();

const manager = new CartManager(path.join(__dirname, '../../data/carts.json'));


router.post('/', async (req, res) => {
  // crea un nuevo carrito
  const cart = await manager.createCart()
  res.json(cart);
})

router.get('/:cid', async(req, res) => {
  // trae un carrito por su ID
  const cart = await manager.getCartById(req.params.cid);
  if(!cart) return res.status(404).json({error: "No se encontro carrito"});
  res.json(cart);
})

router.post('/:cid/product/:pid', async (req, res) => {
  // utilizando el try-catch, agrega un producto a un carrito especifico utilizando el ID de ambos pasados como params
  try {
    await manager.addProductToCart(req.params.cid, req.params.pid);
    res.json({message: "Producto agregado"});
  } catch (error) {
    res.status(404).json({error: error.message});
  }
})

module.exports = router;