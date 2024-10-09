// backend/src/projects/dto/connect-repo.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class ConnectRepoDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  repositoryUrl: string;
}
