import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      forbidNonWhitelisted: true,
      transform: true,
      whitelist: true,
      enableDebugMessages: true,
    }),
  );

  await app.listen(3000);
}

(async () => {
  await bootstrap();
})();
