import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './domain/favorite.entity';

export interface FavoritesRepository {
  list(userId: string): Promise<Favorite[]>;
  upsert(payload: CreateFavoriteDto): Promise<Favorite>;
  remove(userId: string, movieId: number): Promise<void>;
}
