import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;
}

export class SearchMoviesQueryDto extends PaginationQueryDto {
  @IsString()
  query!: string;
}

export class MovieParamDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  id!: number;
}
