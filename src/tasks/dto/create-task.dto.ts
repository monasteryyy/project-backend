import {
  IsString,
  IsNumber,
  IsIn,
  Min,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsIn(['hora', 'dia'])
  paymentType!: string;

  @IsNumber()
  @Min(1)
  value!: number;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsNumber()
  @Min(1)
  userId!: number;
}