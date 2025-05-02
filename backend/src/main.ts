import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import "reflect-metadata";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin:
      configService.get("NODE_ENV") === "development"
        ? "http://localhost:5173" // Vite's default port
        : "https://your-production-domain.com",
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix("api");

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = configService.get("PORT") || 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();
