import { Injectable } from '@nestjs/common';

import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { Favorite } from '../domain/favorite.entity';
import { FavoritesRepository } from '../favorites.repository';

@Injectable()
export class InMemoryFavoritesRepository implements FavoritesRepository {
  private readonly store = new Map<string, Map<number, Favorite>>();

  list(userId: string): Promise<Favorite[]> {
    const favorites = this.store.get(userId);
    if (!favorites) {
      return Promise.resolve([]);
    }
    return Promise.resolve(
      Array.from(favorites.values()).sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
      ),
    );
  }

  upsert(payload: CreateFavoriteDto): Promise<Favorite> {
    const favoritesForUser =
      this.store.get(payload.userId) ?? new Map<number, Favorite>();

    const now = new Date();
    const existing = favoritesForUser.get(payload.movieId);
    const favorite: Favorite = {
      id: existing?.id ?? `${payload.userId}-${payload.movieId}`,
      userId: payload.userId,
      movieId: payload.movieId,
      title: payload.title,
      posterUrl: payload.posterUrl,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    favoritesForUser.set(payload.movieId, favorite);
    this.store.set(payload.userId, favoritesForUser);
    return Promise.resolve(favorite);
  }

  remove(userId: string, movieId: number): Promise<void> {
    const favorites = this.store.get(userId);
    if (favorites) {
      favorites.delete(movieId);
    }
    return Promise.resolve();
  }
}
