import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class GroupFiltersDto {
  @ApiPropertyOptional({ description: 'Search by group name' })
  @IsString()
  @IsOptional()
  searchTerm?: string;

  @ApiPropertyOptional({
    description: 'Filter by status (e.g. Active, Closed)',
  })
  @IsString()
  @IsOptional()
  status?: string;
}
