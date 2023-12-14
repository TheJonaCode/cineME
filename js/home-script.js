$(document).ready(function() {

  // ----- OBTENIENDO JSON DE DIARY.EXCEL (a través de transmisión en la URL desde index.html)
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const encodedData = urlParams.get('data');
  const decodedData = decodeURIComponent(encodedData);
  const moviesJSON = JSON.parse(decodedData);
  console.log(moviesJSON);

  // ----- NAVBAR CONTROLS
  //DOM ELEMENTS
  const navInfo = document.querySelector(".nav-title"); //Navbar Info
  const navTitle = document.querySelector(".nav-info"); //Navbar Title cineME

  //Info
  navInfo.addEventListener("click", function() {
    /*TODO: Info Modal
    With cineME you can get your own cinema based it on your favorite movies.
    Log in into you Letterboxd account and choose one of your list (12 movies),
    export your data and choose your csv file to get a image with your cinema, you'll be able to download oh share it on the social media that you prefer.
    Website made by TheJonaCode
    More of my projects: https://devjonathanperez.netlify.app/
    cineME Repository: https://github.com/TheJonaCode/cineME
    */
  });

  //Title
  navTitle.addEventListener("click", function() {
    window.location.href = 'index.html';
  });

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
    for (let i = 1; i <= movies.length; i++) {
      const groupId =  `movieP${i}`; //AQUÍ VA EL POSTER (IMAGEN)
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
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxYThmZDg3MzY1Nzg3YTA4YmY2YzY5ZGZkODlmZWFjOCIsInN1YiI6IjVmOGNmN2U5ZWZkM2MyMDAzNjNkZjE5NiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.AJfug_P0sWeef_HU0KXKHy54BfaaEvru6ZpGR8eNNnM'
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
  //getPoster('Babylon');

  // ----- MODIFICAR SVG
  // USERNAME
  //DOM ELEMENTS
  const cinemeUser = document.querySelector("#title-username"); //Username title SVG
  const inputUser = document.querySelector("#usernameInput"); //Username Input
  const usernameSpace = document.querySelector("#usernameSVG"); //Username Space SVG

  //CHANGE USERNAME SVG
  function changeUsername() {
    inputUser.addEventListener('keyup', () => {
    console.log(inputUser.value);
    if(inputUser.value == ''){
      cinemeUser.innerHTML = `USER'S NAME`;
      cinemeUser.setAttribute('transform', "matrix(1 0 0 1 190 100)");
    }else{
      cinemeUser.innerHTML = inputUser.value.toUpperCase();
      if(inputUser.value.length == 1){
        cinemeUser.setAttribute('transform', "matrix(1 0 0 1 290 100)");
      }else{
          var defVal = 290;
          var inputLength = 10 * (inputUser.value.length -1);
          var dimX = defVal - inputLength;
          //console.log(dimX);
          cinemeUser.setAttribute('transform', `matrix(1 0 0 1 ${dimX} 100)`);
      }
    }
  })}
  changeUsername();

  // CHANGE A MOVIE
  //DOM ELEMENTS
  const chMovieNumber = document.querySelector("#movie-number"); //Movie Number Input
  const chMovieTitle = document.querySelector("#movie-title"); //Movie Title Input
  const refreshButton = document.querySelector("#refresh-button"); //Refresh Button

  refreshButton.addEventListener("click", function() {
    console.log('NUMBER: ' + chMovieNumber.value);
    console.log('TITLE: ' + chMovieTitle.value);
    
    if(chMovieNumber == '' || chMovieTitle == '' || chMovieNumber == null || chMovieTitle == null){
      //TODO: ALERT
      console.log('Ingresa una película y el num donde irá ubicada');
    }else{
      const newMovieTitle = document.querySelector(`#movieT${chMovieNumber.value}`);
      const newMoviePoster = document.querySelector(`#movieP${chMovieNumber.value}`); //POSTER
      const newMovieDimensions = document.querySelector(`#movieDiv${chMovieNumber.value}`); //OBTENER DIMENSIONES Y UBICACIÓN
      
      //FECTH
      async function changingAMovie(){
        const newFetchMovie = await fetchMovie(chMovieTitle.value);
        const newMovie = newFetchMovie.original_title;
        newMovieTitle.innerHTML = newMovie;
        const posterurl = 'https://image.tmdb.org/t/p/w500';
        const newPosterPath = newFetchMovie.poster_path;
        const newPoster = posterurl + newPosterPath;
        //const imagenURL = await getPoster(newMovie); // Obtiene la URL del póster utilizando la función getPoster()
        const imagenURL = newPoster;

        // Crea un elemento <image>
        const imagen = document.createElementNS('http://www.w3.org/2000/svg', 'image');

        // Establece los atributos del elemento <image>
        imagen.setAttribute('x', newMovieDimensions.getAttribute('x'));
        imagen.setAttribute('y', newMovieDimensions.getAttribute('y'));
        imagen.setAttribute('width', newMovieDimensions.getAttribute('width'));
        imagen.setAttribute('height', newMovieDimensions.getAttribute('height'));
        imagen.setAttribute('href', imagenURL); // Agrega la URL de la imagen

        // Eliminar hijos existentes
        //newMoviePoster.removeChild(image);
        // Adjunta el elemento <image> como hijo del <g> (Group)
        newMoviePoster.appendChild(imagen);
        }
        changingAMovie();
      }
    });

  //CREAR IMAGEN
  function createImage(groupPoster, rectDimensions, imagenURL){
    //groupPoster: <g> donde se muestra el poster
    //rectDimensions: <rect> superior para obtener las dimensiones y ubicación x, y 
    //imagenURL: url del poster a mostrarse
    
    // Crea un elemento <image>
    const imagen = document.createElementNS('http://www.w3.org/2000/svg', 'image');

    // Establece los atributos del elemento <image>
    imagen.setAttribute('x', rectDimensions.getAttribute('x'));
    imagen.setAttribute('y', rectDimensions.getAttribute('y'));
    imagen.setAttribute('width', rectDimensions.getAttribute('width'));
    imagen.setAttribute('height', rectDimensions.getAttribute('height'));
    imagen.setAttribute('href', imagenURL); // Agrega la URL de la imagen

    // Eliminar hijos existentes
    groupPoster.removeChild();
    // Adjunta el elemento <image> como hijo del <g> (Group)
    groupPoster.appendChild(imagen);
  }

  // ----- DOWNLOAD & SHARE
  //DOM ELEMENTS
  const downloadbtn = document.querySelector(".btn-download"); //Download Button
  const sharefb = document.querySelector(".share-fb"); //Share Facebook
  const sharewa = document.querySelector(".share-wa"); //Share WhatsApp
  const sharetw = document.querySelector(".share-tw"); //Share Twitter
  const shareig = document.querySelector(".share-ig"); //Share Instagram

  //Download
  downloadbtn.addEventListener("click", function() {
    console.log('DESCARGANDO...')
  });

  /*TODO: Share - get class and share it on the social media that corresponds
  My own cinema! [Add Emojis]
  Maked it by cineME. Make yours here: cineme.netlify.app/  
  */

});