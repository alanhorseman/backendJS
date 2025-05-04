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