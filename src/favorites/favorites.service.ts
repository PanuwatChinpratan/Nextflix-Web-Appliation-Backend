import { Inject, Injectable, Logger } from '@nestjs/common';

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './domain/favorite.entity';
import type { FavoritesRepository } from './favorites.repository';
import { FAVORITES_REPOSITORY } from './favorites.tokens';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    @Inject(FAVORITES_REPOSITORY)
    private readonly repository: FavoritesRepository,
  ) {}

  async list(userId: string): Promise<Favorite[]> {
    this.logger.debug(`Listing favorites for user=${userId}`);
    return this.repository.list(userId);
  }

  async save(payload: CreateFavoriteDto): Promise<Favorite> {
    this.logger.debug(
      `Saving favorite movie=${payload.movieId} for user=${payload.userId}`,
    );
    return this.repository.upsert(payload);
  }

  async remove(userId: string, movieId: number): Promise<void> {
    this.logger.debug(`Removing favorite movie=${movieId} for user=${userId}`);
    await this.repository.remove(userId, movieId);
  }
}
