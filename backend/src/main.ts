import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as compression from "compression";
import helmet from "helmet";
import { PrismaService } from "./prisma/prisma.service";

async function bootstrap() {
  // Create NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable shutdown hooks for Prisma
  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // Enable CORS - configure for Replit
  app.enableCors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  });

  // Set up global pipes for validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Set global prefix for all routes
  app.setGlobalPrefix("api");

  // Start the server
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${port}/api`);
}

bootstrap().catch((err) => {
  console.error("Error starting server:", err);
});
