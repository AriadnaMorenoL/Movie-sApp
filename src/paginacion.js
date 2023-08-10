import cargarTitulos from "./cargarTitulos";
import fetchBusqueda from "./fetchBusqueda";

const previous = document.getElementById("previous-page");
const next = document.getElementById("next-page");

next.addEventListener("click", async (e) => {
  const actualPage = document.getElementById("populares").dataset.pagina;

  try {
    const resultados = await fetchBusqueda(actualPage + 1);

    document
      .getElementById("populares")
      .setAttribute("data-pagina", parseInt(actualPage) + 1);

    cargarTitulos(resultados);
    window.scrollTo(0, 0);
  } catch (error) {
    console.log(error);
  }
});

previous.addEventListener("click", async (e) => {
  const actualPage = document.getElementById("populares").dataset.pagina;

  if (actualPage > 1) {
    try {
      const resultados = await fetchBusqueda(actualPage - 1);

      document
        .getElementById("populares")
        .setAttribute("data-pagina", parseInt(actualPage) - 1);

      cargarTitulos(resultados);
      window.scrollTo(0, 0);
    } catch (error) {
      console.log(error);
    }
  }
});
