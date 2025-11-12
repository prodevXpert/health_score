import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com', description: 'User email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', description: 'User password (min 6 characters)', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  fullName: string;

  @ApiPropertyOptional({ example: '+91-9876543210', description: 'Phone number' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: '1990-01-01', description: 'Date of birth (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ example: 'M', description: 'Gender', enum: ['M', 'F', 'O'] })
  @IsOptional()
  @IsEnum(['M', 'F', 'O'])
  gender?: string;

  @ApiPropertyOptional({ example: 'Mumbai', description: 'City of residence' })
  @IsOptional()
  city?: string;

  @ApiPropertyOptional({
    example: 'user',
    description: 'User role (admin, user, insurer). Defaults to user. Only admins can set this field.',
    enum: UserRole
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}

