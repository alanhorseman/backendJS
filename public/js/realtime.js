const socket = io();

socket.on("productList", (products) => {
  const list = document.getElementById("product-list"); // Obtengo la lista de productos por su ID
  list.innerHTML = ""; // Limpio la lista

  products.forEach((p) => {
    const li = document.createElement("li");

    let productHtml = `
      <h3>${p.title}</h3>
      <p><strong>Descripción:</strong> ${p.description}</p>
      <p><strong>Código:</strong> ${p.code}</p>
      <p><strong>Precio:</strong> $${p.price}</p>
      <p><strong>Stock:</strong> ${p.stock} unidades</p>
    `;

    productHtml += `<button onclick="deleteProduct('${p.id}')">Eliminar</button>`;

    if (p.thumbnails && p.thumbnails.length > 0) {
      productHtml += `<p><strong>Imágenes:</strong></p><ul>`;
      p.thumbnails.forEach((thumbnail) => {
        productHtml += `<li><img src="${thumbnail}" alt="Miniatura del producto" style="max-width: 100px; height: auto;"></li>`;
      });
      productHtml += `</ul>`;
    }

    productHtml += `<hr>`;

    li.innerHTML = productHtml;
    list.appendChild(li);
  });
});

document.getElementById("product-form").addEventListener("submit", (e) => {
  console.log("Entro la balubi");
  e.preventDefault();

  const newProduct = {
    title: document.querySelector("#title").value,
    description: document.querySelector("#description").value,
    code: document.querySelector("#code").value,
    price: parseFloat(document.querySelector("#price").value),
    status: document.querySelector("#status").checked,
    stock: parseInt(document.querySelector("#stock").value),
    category: document.querySelector("#category").value,
    thumbnails: []
    // thumbnails: document.querySelector("#thumbnails").files,
  }

  socket.emit("createProduct", newProduct);

  console.log("nuevo producto: ", newProduct);
})

function deleteProduct(id) {
    socket.emit("deleteProduct", id);
  }
