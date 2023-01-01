import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserController } from './user/user.controller';
import { DemoModule } from './demo/demo.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [UserModule, DemoModule],
  controllers: [AppController, UserController],
  providers: [AppService],
})
export class AppModule { }
