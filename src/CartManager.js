const fs = require('fs').promises;


class CartManager {
  constructor(path) {
    this.path = path;
  }


  async getCarts(){
    try {
      const data = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(data);
    } catch (error) {
      return []
    }
  }

  async createCart(){
    const carts = await this.getCarts();
    const newID = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;


    const newCart = {id: newID, products:[]}

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));

    return newCart;
  }

  async getCartById(id){
    const carts = await this.getCarts();
    return carts.find(c => c.id === parseInt(id));
  }

  async addProductToCart(cartId, productId){
    const carts = await this.getCarts();
    const cart = carts.find(c => c.id === parseInt(cartId));

    if(!cart) {
      throw new Error(`No se encontro carrito con el id:${cartId}`)
    }

    const productIndex = cart.products.findIndex(p => p.id === productId);

    if(productIndex === -1) {
      cart.products.push({id: productId, quantity: 1});
    } else {
      cart.products[productIndex].quantity += 1;
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
  }
}

module.exports = CartManager;