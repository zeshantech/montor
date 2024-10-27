import { BadRequestException } from '@nestjs/common';

export function parseRepositoryUrl(repoUrl: string) {
  const regex = /https:\/\/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/;
  const match = repoUrl.match(regex);

  if (!match) {
    throw new BadRequestException('Invalid GitHub repository URL');
  }
  const owner = match[1];
  const repo = match[2];
  return { owner, repo };
}
