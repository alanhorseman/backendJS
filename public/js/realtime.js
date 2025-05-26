const socket = io();

//Manipulamos el DOM para crear y mostrar la lista de productos
socket.on('productList', (products) => {
  const list = document.getElementById('product-list'); //obtengo la lista de productos por su ID
  list.innerHTML = ''; //limpio la lista

  products.forEach(p => {
    const li = document.createElement('li'); //creo una etiqueta <li>
    li.innerHTML = `<strong>${p.title}</strong> - $${p.price}`;
    list.appendChild(li); //agrego a la lista de productos el <li> creado
  });
});
