const fetchItem = async (id) => {
  const tipo = document.querySelector(".main__filtros .btn--active").id;
  try {
    let url = `https://api.themoviedb.org/3/${tipo}/${id}?api_key=032e47af9219492d61307c6059c2fc6d&language=en-US`;

    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    return datos;
  } catch (error) {
    console.log(error);
  }
};

export default fetchItem;
