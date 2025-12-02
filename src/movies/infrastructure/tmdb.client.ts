import { HttpService } from '@nestjs/axios';
import {
  BadGatewayException,
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';

export interface TmdbPaginatedResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export interface TmdbMovie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  vote_average?: number;
  runtime?: number;
  tagline?: string;
  homepage?: string;
}

@Injectable()
export class TmdbClient {
  private readonly logger = new Logger(TmdbClient.name);
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl =
      this.configService.get<string>('TMDB_BASE_URL') ??
      'https://api.themoviedb.org/3';
  }

  async getTrending(page: number): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return this.request<TmdbPaginatedResponse<TmdbMovie>>(
      '/trending/movie/day',
      { page },
    );
  }

  async getPopular(page: number): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return this.request<TmdbPaginatedResponse<TmdbMovie>>('/movie/popular', {
      page,
    });
  }

  async search(
    query: string,
    page: number,
  ): Promise<TmdbPaginatedResponse<TmdbMovie>> {
    return this.request<TmdbPaginatedResponse<TmdbMovie>>('/search/movie', {
      query,
      page,
    });
  }

  async getDetails(id: number): Promise<TmdbMovie> {
    return this.request<TmdbMovie>(`/movie/${id}`, {});
  }

  private async request<T>(
    path: string,
    params: Record<string, string | number>,
  ): Promise<T> {
    const apiKey = this.configService.get<string>('TMDB_API_KEY');
    if (!apiKey) {
      this.logger.error('TMDB_API_KEY is missing in environment variables');
      throw new ServiceUnavailableException(
        'TMDB_API_KEY is missing in environment variables',
      );
    }

    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(`${this.baseUrl}${path}`, {
          params: {
            api_key: apiKey,
            language: 'en-US',
            include_adult: false,
            ...params,
          },
        }),
      );
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      const status = axiosError.response?.status;
      this.logger.error(
        `TMDB request failed: ${axiosError.message}`,
        axiosError.stack,
      );

      if (status && status >= 500) {
        throw new BadGatewayException('Upstream movie provider is unavailable');
      }

      throw new BadGatewayException('Unable to fetch movies right now');
    }
  }
}
