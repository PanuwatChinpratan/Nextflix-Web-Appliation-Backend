import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { Favorite } from './domain/favorite.entity';
import { FavoritesService } from './favorites.service';

@ApiTags('favorites')
@Controller('favorites')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @ApiOperation({ summary: 'List favorites for a user' })
  async list(@Query('userId') userId = 'guest'): Promise<Favorite[]> {
    return this.favoritesService.list(userId);
  }

  @Post()
  @ApiOperation({ summary: 'Add or update a movie in favorites' })
  async save(@Body() payload: CreateFavoriteDto): Promise<Favorite> {
    return this.favoritesService.save(payload);
  }

  @Delete(':movieId')
  @ApiOperation({ summary: 'Remove a movie from favorites' })
  async remove(
    @Param('movieId', ParseIntPipe) movieId: number,
    @Query('userId') userId = 'guest',
  ): Promise<void> {
    return this.favoritesService.remove(userId, movieId);
  }
}
