const fs = require('fs').promises;

class ProductManager{

  constructor(path){
    this.path = path;
  }

  async getProducts(){
    // Se intenta acceder al json y se para a obj con .parse, sino devuelve un []
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    // Se traen todos los productos y se busca el que coincida con su ID
    const products = await this.getProducts();
    return products.find(p => p.id === parseInt(id));
  }

  async addProduct(product) {
    // Agrega al json el nuevo producto, modificandolo con fs y retornando el nuevo producto con un id unico
    const products = await this.getProducts();
    
    // Se controla que no falten datos
    if (!product.title || !product.description || typeof product.price !== 'number' || !product.code || typeof product.stock !== 'number' || typeof product.status !== 'boolean' || !product.category || !Array.isArray(product.thumbnails)){
      throw new Error('Complete todos los campos');
    }

    // Se controla por su codigo de producto que no haya uno ya cargado
    if(products.some(p => p.code === product.code)){
      throw new Error(`Este producto ya existe. Cod del producto: ${product.code} ${product.title}`)
    }

    // Obtendo cuantos productos tengo, voy al ultimo y a su ID le sumo 1, si esta vacio le asigno 1
    const asignarID = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {id: asignarID, ...product};

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  async updateProduct(id, newData) {
    // Actualizo un producto con si ID y pasando la data del body

    //Obtengo todos los productos y busco su posicion por si ID
    const products = await this.getProducts();
    const index = products.findIndex(i => i.id === parseInt(id));

    if(index === -1) return null;

    //Se desestructura el producto actual, la info nueva que reemplazara, y se deja el mismo ID
    products[index] = {...products[index], ...newData, id: products[index].id}
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id){
    // Se elimina producto por su ID
    
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    
    if (filtered.length === products.length) return false;

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}

module.exports = ProductManager;