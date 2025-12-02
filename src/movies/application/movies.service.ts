import {
  Injectable,
  Logger,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';

import {
  MovieDetail,
  MovieSummary,
  PaginatedMovies,
} from '../domain/movie.entity';
import {
  TmdbClient,
  TmdbMovie,
  TmdbPaginatedResponse,
} from '../infrastructure/tmdb.client';

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  constructor(private readonly tmdbClient: TmdbClient) {}

  async getTrending(page: number): Promise<PaginatedMovies> {
    try {
      const response = await this.tmdbClient.getTrending(page);
      return this.mapPaginated(response.results, response.page, response);
    } catch (error) {
      this.logger.error(
        'Failed to get trending movies',
        (error as Error).stack,
      );
      throw new ServiceUnavailableException('Unable to load trending movies');
    }
  }

  async getPopular(page: number): Promise<PaginatedMovies> {
    try {
      const response = await this.tmdbClient.getPopular(page);
      return this.mapPaginated(response.results, response.page, response);
    } catch (error) {
      this.logger.error('Failed to get popular movies', (error as Error).stack);
      throw new ServiceUnavailableException('Unable to load popular movies');
    }
  }

  async search(query: string, page: number): Promise<PaginatedMovies> {
    try {
      const response = await this.tmdbClient.search(query, page);
      return this.mapPaginated(response.results, response.page, response);
    } catch (error) {
      this.logger.error('Failed to search movies', (error as Error).stack);
      throw new ServiceUnavailableException('Unable to search for movies');
    }
  }

  async getDetails(id: number): Promise<MovieDetail> {
    try {
      const result = await this.tmdbClient.getDetails(id);
      if (!result) {
        throw new NotFoundException(`Movie ${id} not found`);
      }

      return {
        ...this.toSummary(result),
        runtime: result.runtime ?? null,
        tagline: result.tagline ?? null,
        homepage: result.homepage ?? null,
        genres: result.genres?.map((genre) => genre.name).filter(Boolean) ?? [],
      };
    } catch (error) {
      this.logger.error(
        `Failed to get movie detail for id=${id}`,
        (error as Error).stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new ServiceUnavailableException('Unable to load movie detail');
    }
  }

  private mapPaginated(
    items: TmdbMovie[],
    page: number,
    pagination: Pick<
      TmdbPaginatedResponse<TmdbMovie>,
      'total_pages' | 'total_results'
    >,
  ): PaginatedMovies {
    return {
      page,
      totalPages: pagination.total_pages,
      totalResults: pagination.total_results,
      results: items.map((item) => this.toSummary(item)),
    };
  }

  private toSummary(movie: {
    id: number;
    title?: string;
    name?: string;
    overview?: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average?: number;
    genre_ids?: number[];
  }): MovieSummary {
    const title = movie.title ?? movie.name ?? 'Untitled';
    return {
      id: movie.id,
      title,
      overview: movie.overview ?? '',
      posterUrl: this.buildImageUrl(movie.poster_path, 'w500'),
      backdropUrl: this.buildImageUrl(movie.backdrop_path, 'w1280'),
      releaseDate: movie.release_date ?? movie.first_air_date ?? null,
      rating: Number(movie.vote_average ?? 0),
      genres: [],
    };
  }

  private buildImageUrl(
    path: string | null,
    size: 'w500' | 'w780' | 'w1280' | 'original',
  ): string | null {
    if (!path) {
      return null;
    }
    return `https://image.tmdb.org/t/p/${size}${path}`;
  }
}
