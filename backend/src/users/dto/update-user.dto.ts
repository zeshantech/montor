
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateUserDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    name?: string;
  
    @ApiProperty({ required: false })
    @IsOptional()
    @IsEmail()
    email?: string;
  }