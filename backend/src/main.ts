import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for frontend
  app.enableCors({
    origin: "*",
    credentials: true,
  });

  // Enable validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  );

  // Swagger API Documentation
  const config = new DocumentBuilder()
    .setTitle("HealthScore Bureau API")
    .setDescription(
      "Comprehensive health scoring system API with clinical, laboratory, and lifestyle assessments"
    )
    .setVersion("1.0")
    .addTag("auth", "Authentication endpoints")
    .addTag("users", "User management endpoints")
    .addTag("health-data", "Health data and scoring endpoints")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Enter JWT token",
        in: "header",
      },
      "JWT-auth"
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    customSiteTitle: "HealthScore Bureau API Docs",
    customfavIcon: "https://nestjs.com/img/logo_text.svg",
    customCss: ".swagger-ui .topbar { display: none }",
  });

  const port = process.env.PORT || 5000;
  await app.listen(port);

  console.log(`\n🚀 HealthScore Bureau API Server`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📍 Server running at:     http://localhost:${port}`);
  console.log(`📚 API Documentation:     http://localhost:${port}/api`);
  console.log(`🔐 Authentication:        JWT Bearer Token`);
  console.log(`💾 Database:              PostgreSQL (health_score)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
}

bootstrap();
