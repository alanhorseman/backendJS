const ProductManager = require("./ProductManager");
const manager = new ProductManager("./data/products.json");

let ioGlobal = null; //esto va afuera para que la instacia sea global

const configSocket = (io) => {
  ioGlobal = io;

  //muestra la lista de productos al usuario que se acaba de conectar
  io.on("connection", async (socket) => {
    console.log("Cliente conectado con socket");

    const products = await manager.getProducts();
    socket.emit("productList", products); //emite la lista de productos al usuario conectado (socket)

    socket.on("deleteProduct", async (id) => {
      const result = await manager.deleteProduct(id);

      if (result) {
        console.log(`Producto con el id:${id} eliminado`);
        emitProductUpdate();
      } else {
        console.log(`No se encontro producto con el id:${id}`);
      }
    });

    socket.on("createProduct", async(newProduct) => {
      const result = await manager.addProduct(newProduct);

      if(result) {
        console.log("Producto guardado");
        emitProductUpdate()
      } else {
        console.log("No se pudo guardar producto");
      }
    })
  });
};

const emitProductUpdate = async () => {
  if (ioGlobal) {
    const products = await manager.getProducts();
    ioGlobal.emit("productList", products); //aca en cambio emite la lista a todos los usuarios (ioGlobal)
  }
};

module.exports = { configSocket, emitProductUpdate };
