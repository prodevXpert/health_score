import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../../users/entities/user.entity';

export class UpdateRoleDto {
  @ApiProperty({ 
    example: 'admin', 
    description: 'New role for the user', 
    enum: UserRole 
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;
}

