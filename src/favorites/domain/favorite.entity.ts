export interface Favorite {
  id: string;
  userId: string;
  movieId: number;
  title: string;
  posterUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
