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
    //Recorriendo JSON + Fetch de cada película
    async function fetchMoviesData() {
      const movies = moviesJSON;
      const movieDataArray = [];
    
      for (const movie of movies) {
        const movieTitle = movie.Name;
        const movieData = await fetchMovie(movieTitle);
        
        if (movieData) {
          movieDataArray.push(movieData);
        }
      }
    
      return movieDataArray;
    }
    
    // Llama a la función para obtener información de todas las películas en el JSON
    fetchMoviesData()
      .then(movieDataArray => {
        console.log(movieDataArray);
      })
      .catch(error => {
        console.error('Error al obtener información de las películas:', error);
      });

    //Colocando cada Título
    const movies = moviesJSON;
    for (let i = 0; i < movies.length; i++) {
      const movieTitle = movies[i].Name;
      const containerId = `movieT${i + 1}`;
      const container = document.getElementById(containerId);
    
      if (container) {
        container.innerHTML = movieTitle; // Asigna el título al contenido del contenedor
      }
    }

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