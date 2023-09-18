$(document).ready(function() {

  // ----- OBTENIENDO JSON DE DIARY.EXCEL (a través de transmisión en la URL desde index.html)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const encodedData = urlParams.get('data');
  const decodedData = decodeURIComponent(encodedData);
  const moviesJSON = JSON.parse(decodedData);
  console.log(moviesJSON);

  // ----- SHOWING INFO
  //Título
  const movies = moviesJSON;
  for (let i = 0; i < movies.length; i++) {
    const movieTitle = movies[i].Name;
    const containerId = `movieT${i + 1}`;
    const container = document.getElementById(containerId);
    if (movieTitle.length > 25) {
      const movieTitleCrop = movieTitle.substring(0, 20) + '...';
      if (container) {
        container.innerHTML = movieTitleCrop; // Asigna el título al contenido del contenedor
      }
    }else{
      if (container) {
        container.innerHTML = movieTitle; // Asigna el título al contenido del contenedor
      }
    }
  }

  //Poster
  async function loadPosters() {
    // Recorre los elementos <rect> con IDs movieDiv1, movieDivP2, etc.
    // Recorre los elementos <g> con IDs movieP, movieP2, etc.
    for (let i = 1; i <= 12; i++) {
      const groupId =  `movieP${i}`; //AQUÍ VA EL POSTER
      const rectId =  `movieDiv${i}`; //DE AQUÍ OBTIENE DIMENSIONES Y UBICACIÓN
      const rect = document.getElementById(rectId);
      const group = document.getElementById(groupId);
      const movieTitle = moviesJSON[i - 1].Name; // Obtiene el nombre de la película desde el JSON
      const imagenURL = await getPoster(movieTitle); // Obtiene la URL del póster utilizando la función getPoster()

      // Crea un elemento <image>
      const imagen = document.createElementNS('http://www.w3.org/2000/svg', 'image');

      // Establece los atributos del elemento <image>
      imagen.setAttribute('x', rect.getAttribute('x'));
      imagen.setAttribute('y', rect.getAttribute('y'));
      imagen.setAttribute('width', rect.getAttribute('width'));
      imagen.setAttribute('height', rect.getAttribute('height'));
      imagen.setAttribute('href', imagenURL); // Agrega la URL de la imagen

      // Adjunta el elemento <image> como hijo del <g> (Group)
      group.appendChild(imagen);
    }
  }
  loadPosters();


  // ----- FETCH API THE MOVIE DB
  async function fetchMovie(movieTitle){
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNTk5MjRlZmVmMmZhZTZmYjM2ODUwMzk5YWI5YjEwZCIsInN1YiI6IjVmOGNmN2U5ZWZkM2MyMDAzNjNkZjE5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZPxtN7CeIJC14QaE0ktztv1JoKWuq7sFRoX6cgPQTEs'
      }
    };

    const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${movieTitle}`, options);
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      return data.results[0]; // Devuelve solo el primer elemento del arreglo
    } else {        
      // Manejo en caso de que no se encuentren resultados
      //console.log(movieTitle);
      return {
        title : movieTitle,
        poster_path : "/wjOHjWCUE0YzDiEzKv8AfqHj3ir.jpg",
        genre_ids: [0]
      };
    }
  }
  //fetchMovie('Titanic');

  // ----- OBTENER POSTER
  async function getPoster(movieTitle){
    pelicula = movieTitle;
    movieInfo = await fetchMovie(pelicula);
    //console.log(movieInfo)
    //Obtener Poster
    const posterurl = 'https://image.tmdb.org/t/p/w500';
    const moviePoster = posterurl + movieInfo.poster_path;
    //console.log('POSTER: ' + moviePoster);
    return moviePoster;
  }
  //getPoster('Back To The Future');

  // ----- MODIFICAR SVG
  // USERNAME
  //DOM ELEMENTS
  const cinemeUser = document.querySelector("#title-username"); //Username title SVG
  const inputUser = document.querySelector("#usernameInput"); //Username Input
  const usernameSpace = document.querySelector("#usernameSVG"); //Username Space SVG

  //CHANGE USERNAME SVG
  function changeUsername() {
    //console.log(inputUser.value);
    if(inputUser.value == ''){
      cinemeUser.innerHTML = `USER'SNAME`;
    }else{
      //TODO: TO UPPERCASE + MAX VALUE INPUT (20)
      cinemeUser.innerHTML = inputUser.value;
      if(inputUser.length > 8){
        cinemeUser.setAttribute('transform', "matrix(1 0 0 1 180 100)");
      }
    }
  }
  changeUsername();

  // CHANGE A MOVIE
  //DOM ELEMENTS
  const chMovieNumber = document.querySelector("#movie-number"); //Movie Number Input
  const chMovieTitle = document.querySelector("#movie-title"); //Movie Title Input
  const refreshButton = document.querySelector("#refresh-button"); //Rfresh Button

  async function changeMovie(){
    if(chMovieNumber != '' || chMovieTitle != ''){
      //ALERT
    }else{
      const newMovieTitle = document.querySelector(`movieT${chMovieNumber}`);
      const newMoviePoster = document.querySelector(`movieP${chMovieNumber}`); //POSTER
      const newMovieDimensions = document.querySelector(`movieDiv${chMovieNumber}`); //OBTENER DIMENSIONES Y UBICACIÓN
      //FECTH
      newMovie = fetchMovie(chMovieTitle).movieTitle;
      newMovieTitle.innerHTML = newTitle;
      const imagenURL = await getPoster(newMovie); // Obtiene la URL del póster utilizando la función getPoster()

       // Crea un elemento <image>
       const imagen = document.createElementNS('http://www.w3.org/2000/svg', 'image');

       // Establece los atributos del elemento <image>
       imagen.setAttribute('x', newMovieDimensions.getAttribute('x'));
       imagen.setAttribute('y', newMovieDimensions.getAttribute('y'));
       imagen.setAttribute('width', newMovieDimensions.getAttribute('width'));
       imagen.setAttribute('height', newMovieDimensions.getAttribute('height'));
       imagen.setAttribute('href', imagenURL); // Agrega la URL de la imagen

       // Eliminar hijos existentes
       newMoviePoster.removeChild();
       // Adjunta el elemento <image> como hijo del <g> (Group)
       newMoviePoster.appendChild(imagen);
    }
  }

  changeMovie();

});