# Entrega 2
---

En la sugerencia de esta 2da entrega, había 2 formas de realizarla. Decidí tomar la segunda manera, utilizando el servidor *io* dentro de la petición **POST** y **DELETE**

## 📄 app.js

Importé `handlebars` y lo almacené en la variable hbs.

```
const hbs = require('express-handlebars');
```

Configuré el `SocketManager` de la siguiente manera:

```
const { configSocket } = require('./src/SocketManager');
const io = require('socket.io')(http);
configSocket(io);
```

Agregué el `endpoint` para las rutas de **view**.

```
app.use('/', viewRouter);
```

Y configuré el `Handlebars`.

```
app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
```
---

## 📄 SocketManager.js

Primero importo y hago una instancia de `ProductoManager` para manejar sus métodos.

```
const ProductManager = require('./ProductManager');
const manager = new ProductManager('./data/products.json');
```

Creo una variable **ioGlobal** y la instancio en *null*.
```
let ioGlobal = null;
```

Creé 2 funciones flechas: **configSocket** y **emitProductUpdate**.

`configSocket` va a establecer la conexión y mostrar los productos al usuario conectado.
```
const configSocket = (io) => {
  ioGlobal = io;
  
  //muestra la lista de productos al usuario que se acaba de conectar
  io.on('connection', async (socket) => {
    console.log('Cliente conectado con socket');

    const products = await manager.getProducts();
    socket.emit('productList', products); //emite la lista de productos al usuario conectado (socket)
  });
};
```

`emitProductUpdate` en cambio va a mostrar los productos a todos los usuarios¨.
```
const emitProductUpdate = async () => {
  if (ioGlobal) {
    const products = await manager.getProducts();
    ioGlobal.emit('productList', products); //aca en cambio emite la lista a todos los usuarios (ioGlobal)
  }
};
```

Finalmente exporto ambas funciones.

```
module.exports = { configSocket, emitProductUpdate };
```
---
## 📄 view.router.js

Por un lado importo `Express` y `Router`.

```
const express = require('express');
const router = express.Router();
```

Por el otro, importo e instancio también `ProductManager` para usarlo en la ruta */home*.

```
const ProductManager = require('../ProductManager');
const manager = new ProductManager('./data/products.json');
```

Acá creo las rutas para */home* y */realtimeproducts*

`/home` va a usar los métodos de **ProductManager** ya que no se va a actualizar en tiempo real.
```
router.get('/home', async (req, res) => {
  const products = await manager.getProducts();
  res.render('home', { products });
});
```

En cambio `/realtimeproducts` no necesita de **ProductManager** ya que se maneja con *Socket.io*.

```
router.get('/realtimeproducts', async (req, res) => {
  res.render('realTimeProducts'); 
});
```

Y finalmente se exporta `Router`.
```
module.exports = router;
```
---
## 📄 realtime.js

Creé el archivo `realtime.js` dentro de la carpeta */public/js* para usarlo del lado del cliente.

Comencé instanciando *io*

```
const socket = io();
```

Se escucha el evento `'productList'` con **socket.on** y recibiendo por parámetro products.
```
socket.on('productList', (products) => {});
```

Manipulando el `DOM`, se obtiene la lista de productos por su `ID` y se límpia.

```
const list = document.getElementById('product-list'); 
list.innerHTML = '';
```

Y hago uso de un `forEach` para iterar la lista y agregarle un nuevo ítem con los datos del producto, junto con un `if` para verificar si tiene una foto de producto.

```
products.forEach(p => {
    const li = document.createElement('li'); 

    let productHtml = `
      <h3>${p.title}</h3>
      <p><strong>Descripción:</strong> ${p.description}</p>
      <p><strong>Código:</strong> ${p.code}</p>
      <p><strong>Precio:</strong> $${p.price}</p>
      <p><strong>Stock:</strong> ${p.stock} unidades</p>
    `;

    if (p.thumbnails && p.thumbnails.length > 0) {
      productHtml += `<p><strong>Imágenes:</strong></p><ul>`;
      p.thumbnails.forEach(thumbnail => {
        productHtml += `<li><img src="${thumbnail}" alt="Miniatura del producto" style="max-width: 100px; height: auto;"></li>`;
      });
      productHtml += `</ul>`;
    }

    productHtml += `<hr>`;

    li.innerHTML = productHtml; 
    list.appendChild(li); 
  });
```
---
## 📄 products.router.js

Importé la función `emitProductUpdate` de **SocketManager**.

```
const { emitProductUpdate } = require('../SocketManager'); 
```

Y lo agregué tanto al `POST` como al `DELETE`.

```
router.post("/", async (req, res) => {
  // Try-catch para intentar agregar un producto
  try {
    const newProduct = await manager.addProduct(req.body);
    await emitProductUpdate();
    res.status(201).json({newProduct});
  } catch (error) {
    res.status(400).json({error: "no se pudo agregar producto"});
  }
})
```

```
router.delete("/:pid", async (req, res) => {
  // Eliminamos un producto por su ID enviado tambien por params
  const deleted = await manager.deleteProduct(req.params.pid);
  if (!deleted) return res.status(404).json({error: "No fue posible eliminar el producto"});
  await emitProductUpdate();
  res.json({message: "Producto eliminado"})
})
```
---
## 📄 home.handlebars

Creé el *handlebars* para `/home` con la información estática.

```
<h1>Lista de productos (estática)</h1>
<ul>
  {{#each products}}
    <li>
      <h3>{{title}}</h3>
      <p><strong>Descripción:</strong> {{description}}</p>
      <p><strong>Código:</strong> {{code}}</p>
      <p><strong>Precio:</strong> ${{price}}</p>
      <p><strong>Stock:</strong> {{stock}}</p>
      {{#if thumbnails}}
        <p><strong>Imágenes:</strong></p>
        <ul>
          {{#each thumbnails}}
            <li><img src="{{this}}" alt="Miniatura del producto" style="max-width: 100px; height: auto;"></li>
          {{/each}}
        </ul>
      {{/if}}
      <hr> {{!-- Una línea divisoria para separar productos --}}
    </li>
  {{/each}}
</ul>
```
---
## 📄 realtimeproducts.handlebars

Y el *handlebars* para `/realtimeproducts` con la información dinámica que manejara el **socket.io**.

```
<h1>Lista de productos (tiempo real)</h1>
<ul id="product-list"></ul>

<script src="/socket.io/socket.io.js"></script>
<script src="/js/realtime.js"></script>
```

# Entrega 1
---

## 📄 app.js

Primero importé **express** y lo almacené en la variable app y una constante donde se almacena el puerto:

```js
const express = require("express");
const app = express();
const PORT = 8080;
```

Cree los endpoints para `/products` y `/carts`:

```js
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
```

Pongo el servidor *a escuchar* en el **puerto 8080** usando la constante creada y avisándolo por un log:

```js
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})
```

---

## 📄 products.router.js

Importé `path` y la class `ProductManager` además de `express` nuevamente y `Router`:

```js
const express = require('express');
const path = require('path')
const ProductManager = require('../productmanager');
const router = express.Router();
```

Luego hice una instancia de `ProductManager`, usando el *__dirname* como primer parámetro para partir de este mismo archivo, y el resto de la ruta como segundo parámetro *'../../data/products.json'*:

```js
const manager = new ProductManager(path.join(__dirname, '../../data/products.json'));
```

Configure las rutas del **endpoint** creado para productos `/products`:  

- `router.get("/", async (req, res) => {})`  
  *llama al método `.getProducts` para obtener los productos*
- `router.get("/:pid", async (req,res) => {})`  
  *llama al método `.getProductsId` para obtener un producto especifico por su ID*
- `router.post("/", async (req, res) => {})`  
  *llama al método `.addProduct` para crear un nuevo producto pasado por el body*  
- `router.put("/:pid", async (req, res) => {})`  
  *actualizamos un producto por su ID usando el body*  
- `router.delete("/:pid", async (req, res) => {})`  
  *eliminamos un producto por su ID*  

---

## 📄 ProductManager.js

Importo `fs` con *promises*:

```js
const fs = require('fs').promises;
```

La clase `ProductManager` se encarga de ejecutar los métodos solicitados desde el **Router**.  
Usando métodos asincronos para:

- Obtener productos: `async getProducts(){})`
- Obtener productos por su ID: `async getProductById(id) {})`
- Agregar nuevos productos: `async addProduct(product) {})`
- Actualizar un producto: `async updateProduct(id, newData) {})`
- Eliminar un producto por su ID: `async deleteProduct(id){})`

Y por último se encuentra el `products.json` donde se encuentra un array vacio donde se almacenaran todos los objetos de productos.

---

## 📄 carts.router.js

Al igual que `ProductManager`, importe `path` y `Router` junto con `Express` y la importación de la clase `CartManager` para usarla como manager:

```js
const express = require('express');
const path = require('path');
const CartManager = require('../CartManager');
const router = express.Router();

const manager = new CartManager(path.join(__dirname, '../../data/carts.json'));
```

Las rutas del **endpoint** para `/cart`:

- `router.post('/', async (req, res) => {})`  
  *llama al método `.createCart` para crear un nuevo carrito*  
- `router.get('/:cid', async(req, res) => {})`  
  *obtengo un carrito mediante su ID con `.getCartById`*  
- `router.post('/:cid/product/:pid', async (req, res) => {})`  
  *agrego un nuevo producto al carrito mediante el id de ambos*  

---

## 📄 CartManager.js

Los **métodos** de esta clase son:

- Obtener todos los carritos: `async getCarts(){})`
- Crear un nuevo carrito: `async createCart(){})`
- Obtener un carrito por su ID: `async getCartById(id){})`
- Agregar un producto tomando el ID del mismo y el ID del carrito: `async addProductToCart(cartId, productId){})`

Al igual que el anterior json, `carts.json` contiene un array vacío `[]`.

---


Por último, armé el .md y para darle un poco más de diseño lo pasé por un editor de Markdown online