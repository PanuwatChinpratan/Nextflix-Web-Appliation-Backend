import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';

import { MoviesService } from '../application/movies.service';
import { MovieDetail, PaginatedMovies } from '../domain/movie.entity';
import {
  MovieParamDto,
  PaginationQueryDto,
  SearchMoviesQueryDto,
} from './dto/movie-query.dto';

@ApiTags('movies')
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get('trending')
  @ApiOperation({ summary: 'Get trending movies today' })
  async getTrending(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedMovies> {
    return this.moviesService.getTrending(query.page);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Get popular movies' })
  async getPopular(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginatedMovies> {
    return this.moviesService.getPopular(query.page);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search movies by text' })
  @ApiQuery({ name: 'query', type: String })
  async search(@Query() query: SearchMoviesQueryDto): Promise<PaginatedMovies> {
    return this.moviesService.search(query.query, query.page);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get movie detail' })
  async getDetails(@Param() params: MovieParamDto): Promise<MovieDetail> {
    return this.moviesService.getDetails(params.id);
  }
}
