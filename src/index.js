import fetchPopulares from "./fetchPopulares";
import cargarTitulos from "./cargarTitulos";
import cargarGeneros from "./cargarGeneros";
import "./listenerFiltroTipo";
import "./listenerGeneros";
import "./listenerBuscar";
import "./paginacion";
import "./listenerItems";
import "./listenerPopUp";

const cargar = async () => {
  const resultados = await fetchPopulares();
  cargarTitulos(resultados);
  cargarGeneros("movie");
};
cargar();
