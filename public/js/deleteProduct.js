document.addEventListener("DOMContentLoaded", () =>{
  //Buscamos todos los botones con la class delete-btn
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const productID = button.getAttribute("data-id");

      if (!productID) return console.log("ID de producto no encontrado");

      const confirmDelete = confirm("Estas seguro que desea elminar este producto?");
      if (!confirmDelete) return;

      try {
        const response = await fetch(`/api/products/${productID}`, {
          method: "DELETE",
        });

        if (response.ok) {
          console.log("Producto eliminado correctamente");
          window.location.reload();
        } else {
          const error = await response.json();
          console.log(`Error al eliminar: ${error.message || "desconocido"}`);
        }
      } catch (error){
        console.error("Error en la solicitud DELETE:", error);
        console.log("Error de red o del servidor");
      }
    })
  })
})