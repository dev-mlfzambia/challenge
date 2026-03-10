import { ApiProperty } from '@nestjs/swagger';

export class GroupPackageBalanceResponseDto {
  @ApiProperty({
    description: 'Group package ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  groupPackageId: string;

  @ApiProperty({
    description: 'Group name',
    example: 'Maiko Group',
  })
  groupName: string;

  @ApiProperty({
    description: 'Total outstanding balance',
    example: 15000.0,
  })
  totalBalance: number;

  @ApiProperty({
    description: 'Principal amount outstanding',
    example: 12000.0,
  })
  principalOutstanding: number;

  @ApiProperty({
    description: 'Interest amount outstanding',
    example: 2500.0,
  })
  interestOutstanding: number;

  @ApiProperty({
    description: 'Penalty amount outstanding',
    example: 300.0,
  })
  penaltyOutstanding: number;

  @ApiProperty({
    description: 'Application fee outstanding',
    example: 200.0,
  })
  applicationFeeOutstanding: number;

  @ApiProperty({
    description: 'Service fee outstanding',
    example: 0.0,
  })
  serviceFeeOutstanding: number;

  @ApiProperty({
    description: 'Last updated timestamp',
    example: '2025-11-07T10:30:00Z',
  })
  lastUpdated: Date;

  @ApiProperty({
    description: 'Group package status',
    example: 'Active',
  })
  status: string;

  constructor(partial: Partial<GroupPackageBalanceResponseDto>) {
    Object.assign(this, partial);
  }
}
