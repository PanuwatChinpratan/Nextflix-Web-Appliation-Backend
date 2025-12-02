import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { PrismaModule } from '../prisma/prisma.module';
import { InMemoryFavoritesRepository } from './infrastructure/in-memory-favorites.repository';
import { PrismaFavoritesRepository } from './infrastructure/prisma-favorites.repository';
import { FavoritesController } from './favorites.controller';
import { FavoritesRepository } from './favorites.repository';
import { FavoritesService } from './favorites.service';
import { FAVORITES_REPOSITORY } from './favorites.tokens';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    InMemoryFavoritesRepository,
    PrismaFavoritesRepository,
    {
      provide: FAVORITES_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        prismaRepository: PrismaFavoritesRepository,
        memoryRepository: InMemoryFavoritesRepository,
      ): FavoritesRepository => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        if (databaseUrl) {
          return prismaRepository;
        }
        return memoryRepository;
      },
      inject: [
        ConfigService,
        PrismaFavoritesRepository,
        InMemoryFavoritesRepository,
      ],
    },
  ],
  exports: [FavoritesService],
})
export class FavoritesModule {}
