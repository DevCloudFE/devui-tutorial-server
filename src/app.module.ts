import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoginController } from './login/login.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';
import {LoggingInterceptor} from './interceptor/logging.interceptor';
import { IsLoginController } from './is-login/is-login.controller';
import { ArticlesModule } from './articles/articles.module';
import { DashboardController } from './dashboard/dashboard.controller';
import { InMemoryDBModule } from '@nestjs-addons/in-memory-db';
@Module({
  imports: [ArticlesModule, InMemoryDBModule.forRoot()],
  controllers: [AppController,  LoginController, IsLoginController, DashboardController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    }
  ],
})
export class AppModule {}
