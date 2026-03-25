import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Finish backend integration' })
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ example: 'Connect frontend login to JWT-protected API' })
  @IsOptional()
  description?: string;

  @ApiProperty({ example: '65f1b8f8d6f98d4a6a7c1234' })
  @IsMongoId()
  assignedTo: string;
}
