import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  MinLength,
  MaxLength,
} from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty({ example: 'Buy groceries', required: false })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @ApiProperty({ example: 'Milk, eggs, bread', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({ example: 'high', enum: ['low', 'medium', 'high'], required: false })
  @IsEnum(['low', 'medium', 'high'])
  @IsOptional()
  priority?: 'low' | 'medium' | 'high';

  @ApiProperty({ example: 'in_progress', enum: ['todo', 'in_progress', 'done'], required: false })
  @IsEnum(['todo', 'in_progress', 'done'])
  @IsOptional()
  status?: 'todo' | 'in_progress' | 'done';

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsDateString()
  @IsOptional()
  dueDate?: string;
}