import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { Favorite } from '../domain/favorite.entity';
import { FavoritesRepository } from '../favorites.repository';

@Injectable()
export class PrismaFavoritesRepository implements FavoritesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string): Promise<Favorite[]> {
    return this.prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async upsert(payload: CreateFavoriteDto): Promise<Favorite> {
    return this.prisma.favorite.upsert({
      where: {
        user_movie_unique: {
          userId: payload.userId,
          movieId: payload.movieId,
        },
      },
      update: {
        title: payload.title,
        posterUrl: payload.posterUrl,
      },
      create: {
        userId: payload.userId,
        movieId: payload.movieId,
        title: payload.title,
        posterUrl: payload.posterUrl,
      },
    });
  }

  async remove(userId: string, movieId: number): Promise<void> {
    await this.prisma.favorite.delete({
      where: {
        user_movie_unique: {
          userId,
          movieId,
        },
      },
    });
  }
}
