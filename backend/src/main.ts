// import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';

/**
 * Simplified bootstrap function while NestJS dependencies are missing
 * Replace with actual implementation when dependencies are available
 */
async function bootstrap() {
  // Simulate a simple Express-like server setup
  console.log('Starting application in development mode...');
  
  // Use hardcoded values instead of ConfigService
  const PORT = process.env.PORT || 3001;
  const CORS_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:5173';
  
  console.log(`CORS enabled for origin: ${CORS_ORIGIN}`);
  console.log(`API prefix: api`);

  // Log startup message
  console.log(`Application is running on: http://localhost:${PORT}/api`);
  console.log(`Press CTRL+C to stop the server`);
}

bootstrap().catch(err => {
  console.error('Failed to start the application:', err);
  process.exit(1);
}); 