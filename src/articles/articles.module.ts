import { Module } from '@nestjs/common';
import { ArticleController } from './article.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
@Module({
  imports: [InMemoryDBModule.forFeature('article')],
  controllers: [ArticleController],
  providers: [],
})
export class ArticlesModule {}
