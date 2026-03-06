import { ApiProperty } from '@nestjs/swagger';

export class LoanDto {
  @ApiProperty({ description: 'Loan ID', example: 'loanId' })
  id: string;

  @ApiProperty({ description: 'Loan amount', example: 1000.0 })
  amount: number;
}
