import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CatsController } from "./cats/cats.controller"
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { CatsModule } from "./cats/cats.module"
import { APP_FILTER } from '@nestjs/core'
import { HttpExceptionFilter } from './cats/http-exception.filter';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }]
})
export class AppModule { }
