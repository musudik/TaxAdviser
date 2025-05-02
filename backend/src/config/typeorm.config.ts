import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { ConfigService } from "@nestjs/config";
import { User } from "../users/entities/user.entity";

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isProduction = configService.get("NODE_ENV") === "production";

  return {
    type: "postgres",
    url: configService.get("DATABASE_URL"),
    entities: [User],
    synchronize: configService.get("NODE_ENV") === "development",
    logging: configService.get("NODE_ENV") === "development",
    ssl: isProduction ? { rejectUnauthorized: false } : false,
  };
};
