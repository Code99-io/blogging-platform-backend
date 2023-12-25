// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { UserEntity } from '../modules/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './auth.entity';
import { AuthRepository } from './auth.repository';
import { UserModule } from 'src/modules/user/user.module';
import { JWT_DEFAULT_SECRET } from 'src/shared/constants';
import { EmailModule } from 'src/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }), // Register PassportModule with the 'jwt' strategy
    JwtModule.register({
      secret: JWT_DEFAULT_SECRET, // Replace with your actual secret key
      signOptions: { expiresIn: '1d' }, // Example token expiration (modify as needed)
    }),
    EmailModule,
    UserModule,
  ],
  providers: [AuthService, AuthRepository, JwtStrategy], // Add JwtStrategy to the providers
  controllers: [AuthController],
})
export class AuthModule {}
