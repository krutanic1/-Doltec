import { IsEmail, IsString, IsEnum, IsOptional, MinLength } from 'class-validator';
import { UserRole, PosterType } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  name: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @IsEnum(PosterType)
  @IsOptional()
  posterType?: PosterType;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
