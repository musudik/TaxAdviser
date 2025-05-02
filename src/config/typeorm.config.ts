import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/entities/user.entity";

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get("NODE_ENV") === "production";
  
  // Parse connection URL manually to handle password issues
  const dbUrl = configService.get<string>("DATABASE_URL");
  
  
  try {
    console.log("Using database connection URL:", dbUrl);
    
    return {
      type: "postgres",
      url: dbUrl,
      entities: [User],
      synchronize: configService.get("NODE_ENV") === "development",
      logging: configService.get("NODE_ENV") === "development",
      // Only use SSL in production
      ...(isProduction && {
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      // Force disable SSL for development
      ...((!isProduction) && {
        ssl: false,
      }),
    };
  } catch (error) {
    console.error("Error parsing DATABASE_URL:", error);
    
    // Fallback to individual connection parameters
    return {
      type: "postgres",
      host: configService.get("DB_HOST") || "localhost",
      port: parseInt(configService.get("DB_PORT") || "5432", 10),
      username: configService.get("DB_USERNAME") || "tax_adviser",
      password: configService.get("DB_PASSWORD") || "tax_adviser",
      database: configService.get("DB_DATABASE") || "tax_adviser_app",
      entities: [User],
      synchronize: configService.get("NODE_ENV") === "development",
      logging: configService.get("NODE_ENV") === "development",
      ssl: isProduction ? {
        rejectUnauthorized: false,
      } : false,
    };
  }
}; 