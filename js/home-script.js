$(document).ready(function() {

    // ----- OBTENIENDO JSON DE DIARY.EXCEL (a través de transmisión en la URL desde index.html)
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedData = urlParams.get('data');
    const decodedData = decodeURIComponent(encodedData);
    const moviesJSON = JSON.parse(decodedData);
    console.log(moviesJSON);
    
          
    // ----- DOM ELEMENTS
    //Title cineME
    const cinemeTitle = document.querySelector(".cineme-title"); //Title

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
      // Recorre los elementos <rect> con IDs movieP1, movieP2, etc.
      for (let i = 1; i <= 12; i++) {
        const rectId =  `movieP${i}`;;
        const rect = document.getElementById(rectId);
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

        // Adjunta el elemento <image> como hijo del <rect>
        rect.appendChild(imagen);
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


});