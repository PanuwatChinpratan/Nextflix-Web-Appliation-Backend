export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  rating: number;
  genres: string[];
}

export interface MovieDetail extends MovieSummary {
  runtime: number | null;
  tagline: string | null;
  homepage: string | null;
}

export interface PaginatedMovies {
  page: number;
  totalPages: number;
  totalResults: number;
  results: MovieSummary[];
}
