const fetchGenero = async (filtro = "movie") => {
  const tipo = filtro === "movie" ? "movie" : "tv";
  const url = `https://api.themoviedb.org/3/genre/${tipo}/list?api_key=032e47af9219492d61307c6059c2fc6d&language=en-US&page=1`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();
    return datos.genres;
  } catch (error) {
    console.log(error);
  }
};

export default fetchGenero;
