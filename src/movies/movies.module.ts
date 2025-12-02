import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { MoviesService } from './application/movies.service';
import { MoviesController } from './presentation/movies.controller';
import { TmdbClient } from './infrastructure/tmdb.client';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 8000,
    }),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, TmdbClient],
  exports: [MoviesService],
})
export class MoviesModule {}
