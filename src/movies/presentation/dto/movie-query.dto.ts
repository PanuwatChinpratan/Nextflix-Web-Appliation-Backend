import { Transform, Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class PaginationQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page = 1;
}

export class SearchMoviesQueryDto extends PaginationQueryDto {
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : String(value ?? ''),
  )
  @IsString()
  @MinLength(1)
  query!: string;
}

export class MovieParamDto {
  @Type(() => Number)
  @IsPositive()
  @IsInt()
  id!: number;
}
