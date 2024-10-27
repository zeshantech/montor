import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUrl,
  IsOptional,
  IsBoolean,
  IsString,
  MaxLength,
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
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  repositoryUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accessToken: string;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsOptional()
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accessToken: string;
}

export class ConnectRepoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accessToken: string;
}

export class ChangeStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  repositoryUrl: string;

  @ApiProperty()
  @IsOptional()
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty()
  @IsOptional()
  @IsString()
  accessToken: string;
}
