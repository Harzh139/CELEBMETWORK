// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('CelebNetwork API')
    .setDescription('Celebrity Discovery API')
    .setVersion('1.0')
    .build();

  const doc = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, doc);

  app.enableCors();
  // Use process.env.PORT or default to 3000
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
