// ./src/projects/dto/project.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  repositoryUrl?: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class ConnectRepoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  repositoryUrl: string;
}
