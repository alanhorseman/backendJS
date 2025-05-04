const fs = require('fs').promises;

class ProductManager{

  constructor(path){
    this.path = path;
  }

  async getProducts(){
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async getProductById(id) {
    const products = await this.getProducts();
    return products.find(p => p.id === parseInt(id));
  }

  async addProduct(product) {
    const products = await this.getProducts();
    
    if (!product.title || !product.description || typeof product.price !== 'number' || !product.code || typeof product.stock !== 'number' || typeof product.status !== 'boolean' || !product.category || !Array.isArray(product.thumbnails)){
      throw new Error('Complete todos los campos');
    }

    if(products.some(p => p.code === product.code)){
      throw new Error(`Este producto ya existe. Cod del producto: ${product.code} ${product.title}`)
    }

    const asignarID = products.length > 0 ? products[products.length - 1].id + 1 : 1;
    const newProduct = {id: asignarID, ...product};

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));

    return newProduct;
  }

  async updateProduct(id, newData) {
    const products = await this.getProducts();
    const index = products.findIndex(i => i.id === parseInt(id));

    if(index === -1) return null;

    products[index] = {...products[index], ...newData, id: products[index].id}
    await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    return products[index];
  }

  async deleteProduct(id){
    const products = await this.getProducts();
    const filtered = products.filter(p => p.id !== parseInt(id));
    
    if (filtered.length === products.length) return false;

    await fs.writeFile(this.path, JSON.stringify(filtered, null, 2));
    return true;
  }
}

module.exports = ProductManager;