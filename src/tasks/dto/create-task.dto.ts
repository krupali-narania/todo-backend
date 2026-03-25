import { IsNotEmpty, IsOptional, IsMongoId } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsOptional()
  description?: string;

  @IsMongoId()
  assignedTo: string;
}
