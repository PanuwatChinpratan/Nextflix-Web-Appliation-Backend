import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, MaxLength } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  userId!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  movieId!: number;

  @IsString()
  @MaxLength(255)
  title!: string;

  @IsOptional()
  @IsString()
  posterUrl?: string | null;
}
