import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsEnum, IsString, IsInt, Min, Max } from 'class-validator';

export class TaskQueryDto {
  @ApiProperty({ required: false, enum: ['todo', 'in_progress', 'done'] })
  @IsOptional()
  @IsEnum(['todo', 'in_progress', 'done'])
  status?: string;

  @ApiProperty({ required: false, enum: ['low', 'medium', 'high'] })
  @IsOptional()
  @IsEnum(['low', 'medium', 'high'])
  priority?: string;

  @ApiProperty({ required: false, type: String, description: 'Search in title and description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: ['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'] })
  @IsOptional()
  @IsEnum(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'])
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['ASC', 'DESC'] })
  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ required: false, default: 1, minimum: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({ required: false, default: 10, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
