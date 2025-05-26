const socket = io();

socket.on('productList', (products) => {
  const list = document.getElementById('product-list'); // Obtengo la lista de productos por su ID
  list.innerHTML = ''; // Limpio la lista

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
});