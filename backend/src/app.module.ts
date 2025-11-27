import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AdminModule } from "./admin/admin.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { HealthDataModule } from "./health-data/health-data.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { RecommendationsModule } from "./recommendations/recommendations.module";
import { ScoringModule } from "./scoring/scoring.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: process.env.DB_HOST || "ballast.proxy.rlwy.net",
      port: parseInt(process.env.DB_PORT) || 57187,
      username: process.env.DB_USERNAME || "postgres",
      password: process.env.DB_PASSWORD || "devxpert",
      database: process.env.DB_NAME || "health_score",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: false, // Set to false in production
      logging: true,
    }),
    AuthModule,
    UsersModule,
    HealthDataModule,
    ScoringModule,
    RecommendationsModule,
    NotificationsModule,
    AdminModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
