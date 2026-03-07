import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Trim } from '../../../decorators/transform.decorators';
import { RoleType } from 'src/constants/role-type';

export class UserRegisterDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'First name is required' })
  @Trim()
  firstName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Last name is required' })
  @Trim()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Username is required' })
  @Trim()
  username: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required' })
  @Trim()
  email: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ enum: RoleType, enumName: 'RoleType' })
  @IsString()
  @IsNotEmpty({ message: 'Role is required' })
  role: RoleType;

  @ApiProperty({ description: 'The UUID of the office this user belongs to' })
  @IsUUID()
  @IsNotEmpty({ message: 'Office ID is required' })
  office: any;

  @ApiProperty({ minLength: 6 })
  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}
