import fetchGenero from "./fetchGenero";
import obtenerGenero from "./obtenerGenero";

const fetchPopulares = async (filtro = "movie") => {
  const tipo = filtro === "movie" ? "movie" : "tv";
  const url = `https://api.themoviedb.org/3/${tipo}/popular?api_key=032e47af9219492d61307c6059c2fc6d&language=en-US&page=1`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const resultados = datos.results;
    const generos = await fetchGenero();

    resultados.forEach((resultado) => {
      resultado.genero = obtenerGenero(resultado.genre_ids[0], generos);
    });

    return resultados;
  } catch (error) {
    console.log(error);
  }
};

export default fetchPopulares;
