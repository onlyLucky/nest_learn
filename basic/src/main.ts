import { NestFactory } from '@nestjs/core';
import { VersioningType } from "@nestjs/common"
import { AppModule } from './app.module';
import * as session from "express-session"

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //使用session
  app.use(session({ secret: "session", name: "code.session", rolling: true, cookie: { maxAge: null } }))
  app.enableVersioning({
    type: VersioningType.URI
  })
  await app.listen(3000);
}
bootstrap();
