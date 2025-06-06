const express = require("express");
const app = express();
const http = require('http').createServer(app);
const path = require('path');
const hbs = require('express-handlebars');

const productsRouter = require("./src/routes/products.router");
const cartsRouter = require("./src/routes/carts.router");
const viewRouter = require("./src/routes/view.router");

//CONFIG DEL SOCKET
const { configSocket } = require('./src/SocketManager');
const io = require('socket.io')(http);
configSocket(io);

const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')));

//RUTAS
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewRouter);

//HANDLEBARS
app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

http.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})