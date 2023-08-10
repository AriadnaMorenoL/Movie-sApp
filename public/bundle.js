'use strict';

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

const obtenerGenero = (id, generos) => {
  let nombre;

  generos.forEach((elemento) => {
    if (id === elemento.id) {
      nombre = elemento.name;
    }
  });
  return nombre;
};

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

const cargarTitulos = (resultados) => {
  const contanedor = document.querySelector("#populares .main__grid");

  contanedor.innerHTML = "";

  resultados.forEach((resultado) => {
    const plantilla = `
      <div class="main__media" data-id="${resultado.id}">
        <a href="#" class="main__media-thumb">
          <img class="main__media-img" src="https://image.tmdb.org/t/p/w500/${
            resultado.poster_path
          }" alt="" />
        </a>
        <p class="main__media-titulo">${resultado.title || resultado.name}</p>
        <p class="main__media-fecha">${resultado.genero}</p>
      </div>
  `;

    contanedor.insertAdjacentHTML("beforeend", plantilla);
  });
};

const contenedorGeneros = document.getElementById("filtro-generos");

const cargarGeneros = async (filtro) => {
  const generos = await fetchGenero(filtro);

  contenedorGeneros.innerHTML = "";

  generos.forEach((genero) => {
    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.innerText = genero.name;
    btn.setAttribute("data-id", genero.id);

    contenedorGeneros.appendChild(btn);
  });
};

const filtroPelicula = document.getElementById("movie");
const filtroSerie = document.getElementById("tv");

filtroPelicula.addEventListener("click", async (e) => {
  e.preventDefault();
  cargarGeneros("movie");

  const resultados = await fetchPopulares("movie");
  cargarTitulos(resultados);

  filtroSerie.classList.remove("btn--active");
  filtroPelicula.classList.add("btn--active");
  document.querySelector("#populares .main__titulo").innerText =
    "Popular Movies";
});

filtroSerie.addEventListener("click", async (e) => {
  e.preventDefault();
  cargarGeneros("tv");

  const resultados = await fetchPopulares("tv");
  cargarTitulos(resultados);

  filtroPelicula.classList.remove("btn--active");
  filtroSerie.classList.add("btn--active");
  document.querySelector("#populares .main__titulo").innerText =
    "Popular Tv shows";
});

const contenedor = document.getElementById("filtro-generos");

contenedor.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.closest("button")) {
    contenedor.querySelector(".btn--active")?.classList.remove("btn--active");

    e.target.classList.add("btn--active");
  }
});

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

const btn = document.getElementById("btn-buscar");
btn.addEventListener("click", async (e) => {
  const resultados = await fetchBusqueda();
  cargarTitulos(resultados);
});

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

const container = document.getElementById("populares");
const popUp$1 = document.getElementById("media");
container.addEventListener("click", async (e) => {
  if (e.target.closest(".main__media")) {
    popUp$1.classList.add("media--active");

    const id = e.target.closest(".main__media").dataset.id;

    const resultado = await fetchItem(id);

    const plantilla = `
          <div class="media__backdrop">
						<img
							src="https://image.tmdb.org/t/p/w500/${resultado.backdrop_path}"
							class="media__backdrop-image"
						/>
					</div>
					<div class="media__imagen">
						<img
							src="https://image.tmdb.org/t/p/w500/${resultado.poster_path}"
							class="media__poster"
						/>
					</div>
					<div class="media__info">
						<h1 class="media__titulo">${resultado.title || resultado.name}</h1>
						<p class="media__fecha">${
              resultado.release_date || resultado.first_air_date
            }</p>
						<p class="media__overview">${resultado.overview}</p>
					</div>
					<button class="media__btn">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							fill="currentColor"
							viewBox="0 0 16 16"
							class="media__btn-icono"
						>
							<path
								d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
							/>
						</svg>
					</button>
    `;

    document.querySelector("#media .media__contenedor").innerHTML = plantilla;
  }
});

const popUp = document.getElementById("media");
popUp.addEventListener("click", (e) => {
  if (e.target.closest("button")) {
    popUp.classList.remove("media--active");
  }
});

const cargar = async () => {
  const resultados = await fetchPopulares();
  cargarTitulos(resultados);
  cargarGeneros("movie");
};
cargar();
//# sourceMappingURL=bundle.js.map
