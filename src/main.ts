import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import Configuration from ''

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(process.env.PORT);
}
bootstrap();
