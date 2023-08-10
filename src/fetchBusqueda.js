import fetchGenero from "./fetchGenero";
import obtenerGenero from "./obtenerGenero";

const fetchBusqueda = async (page = 1) => {
  const tipo = document.querySelector(".main__filtros .btn--active").id;
  const idGenero = document.querySelector("#filtro-generos .btn--active")
    ?.dataset.id;
  const añoInicial = document.getElementById("años-min").value || 1950;
  const añoFinal = document.getElementById("años-max").value || 2023;

  let url;
  if (tipo === "movie") {
    url = `https://api.themoviedb.org/3/discover/movie?api_key=032e47af9219492d61307c6059c2fc6d&certification=us&include_adult=false&include_video=false&language=en-US&page=${page}&release_date.gte=${añoInicial}&release_date.lte=${añoFinal}&sort_by=popularity.desc&with_genres=${idGenero}`;
  } else if (tipo === "tv") {
    url = `https://api.themoviedb.org/3/discover/tv?api_key=032e47af9219492d61307c6059c2fc6d&first_air_date_year=${añoInicial}&first_air_date.gte=${añoFinal}&include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${idGenero}`;
  }

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    const resultados = datos.results;

    const generos = await fetchGenero();
    resultados.forEach((resultado) => {
      resultado.genero = obtenerGenero(resultado.genre_ids[0], generos);
    });

    return resultados;
  } catch (e) {
    console.log(e);
  }
};

export default fetchBusqueda;
