import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/auth-jwt.guard';
import { JwtService } from '@nestjs/jwt';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const reflector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  app.useGlobalGuards(new JwtAuthGuard(reflector, jwtService));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  
  // CORS configurado para mobile e PWA
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://127.0.0.1:3000',
      'http://127.0.0.1:5173',
      // Adicione aqui o domínio de produção quando disponível
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  });

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  console.log(`🚀 Servidor rodando na porta ${port}`);
  console.log(`📱 Acesse: http://localhost:${port}`);
}
bootstrap();
