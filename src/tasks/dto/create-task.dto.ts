import { IsString, IsNumber, IsIn, Min } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsString()
  category!: string;

  @IsString()
  location!: string;

  @IsIn(['HOUR', 'DAY'])
  paymentType!: string;

  @IsNumber()
  @Min(1)
  amount!: number;

  @IsNumber()
  @Min(1)
  userId!: number;
}
