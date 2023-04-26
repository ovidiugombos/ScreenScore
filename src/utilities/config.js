import { key } from "../../TMDBApiKey.js";

const config = {
  searchMovieUrl: `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=`, //by query
  searchTvShowUrl: `https://api.themoviedb.org/3/search/tv?api_key=${key}&query=`, //by query
  apiMovieId: `https://api.themoviedb.org/3/movie/{movieid}?api_key=${key}&language=en-US`,
  apiMovieReview: `https://api.themoviedb.org/3/movie/{movieid}/reviews?api_key=${key}&language=en-US&page=1`,
  apiTvshowId: `https://api.themoviedb.org/3/tv/{tvshowid}?api_key=${key}&language=en-US`,
  apiSimilarMovies: `https://api.themoviedb.org/3/movie/{movieid}/similar?api_key=${key}`,
  apiSimilarTvshows: `https://api.themoviedb.org/3/tv/{tvshowid}/similar?api_key=${key}&language=en-US&page=1`,
  apiPopularUrl: `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US`,
  apiGenresUrl: `https://api.themoviedb.org/3/discover/movie?api_key=${key}&with_genres={genre_id}`,
  apiTopRatedUrl: `https://api.themoviedb.org/3/movie/top_rated?api_key=${key}&language=en-US`,
  apiUpcomingUrl: `https://api.themoviedb.org/3/movie/upcoming?api_key=${key}&language=en-US`,
  apiReviewsUrl: `https://api.themoviedb.org/3/movie/%7Bmovie_id%7D/reviews?api_key=${key}`,
  imgUrl: "https://image.tmdb.org/t/p/w220_and_h330_face/",
  tvApiPopular: `https://api.themoviedb.org/3/tv/popular?api_key=${key}&language=en-US&page=1`,
  tvApiTopRated: `https://api.themoviedb.org/3/tv/top_rated?api_key=${key}&language=en-US&page=1`,
};
export default config;
// `https://api.themoviedb.org/3/movie/${id}?api_key=5da148ae85fba43a0abfb7bff2aca05a&language=en-US`
