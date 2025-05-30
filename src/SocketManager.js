const ProductManager = require('./ProductManager');
const manager = new ProductManager('./data/products.json');

let ioGlobal = null; //esto va afuera para que la instacia sea global

const configSocket = (io) => {
  ioGlobal = io;
  
  //muestra la lista de productos al usuario que se acaba de conectar
  io.on('connection', async (socket) => {
    console.log('Cliente conectado con socket');

    const products = await manager.getProducts();
    socket.emit('productList', products); //emite la lista de productos al usuario conectado (socket)
  });
};

const emitProductUpdate = async () => {
  if (ioGlobal) {
    const products = await manager.getProducts();
    ioGlobal.emit('productList', products); //aca en cambio emite la lista a todos los usuarios (ioGlobal)
  }
};

module.exports = { configSocket, emitProductUpdate };
