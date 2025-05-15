const fs = require('fs').promises;


class CartManager {
  constructor(path) {
    this.path = path;
  }


  async getCarts(){
    // Usa el try-catch junto con un await para leer el .json que fue pasado como parametro
    //    de lo contrario, devuelve un array vacio
    try {
      // Intenta leer el .json y lo devuelve pasado a obj con .parse
      const data = await fs.readFile(this.path, 'utf-8')
      return JSON.parse(data);
    } catch (error) {
      // De lo contrario devuelve un array vacio
      return []
    }
  }

  async createCart(){
    // Crea un nuevo carrito con un ID unico, lo agrega al array de Carritos y lo escribe en el .json

    // Obtiene todos los carritos usando el metodo anterior creado y los almacena en la variable 'carts'
    const carts = await this.getCarts();
    // Le asigna un ID unico
    const newID = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
    // Junta el id y el array de productos en una nueva variable 'newCart'
    const newCart = {id: newID, products:[]}

    // Mete el carrito al array de carritossss
    carts.push(newCart);

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
    return newCart;
  }

  async getCartById(id){
    // Devuelve un carrito especifico por su ID
    const carts = await this.getCarts();
    return carts.find(c => c.id === parseInt(id));
  }

  async addProductToCart(cartId, productId){
    // Agrega el ID de un producto, a un carrito espeficico (por su ID) y lo escribe en el .json

    // Obtiene todos los carritos con el primer metodo de la clase
    const carts = await this.getCarts();
    // busca un carrito especifico comparando los IDs y lo almacena en una variable 'cart'
    const cart = carts.find(c => c.id === parseInt(cartId));

    // Si no existe devuelve un error
    if(!cart) {
      throw new Error(`No se encontro carrito con el id:${cartId}`)
    }

    // Del carrito actual (donde esta ID y el array de productos), 
    // compara el ID de cada producto por el pasado por params y devuelve su index
    const productIndex = cart.products.findIndex(p => p.id === productId);

    // Si no existe (no esta ese producto en el carrito) lo agrega con la cantidad de 1
    if(productIndex === -1) {
      cart.products.push({id: productId, quantity: 1});
      // Si existe simplemente le suma 1
    } else {
      cart.products[productIndex].quantity += 1;
    }

    await fs.writeFile(this.path, JSON.stringify(carts, null, 2))
  }
}

module.exports = CartManager;