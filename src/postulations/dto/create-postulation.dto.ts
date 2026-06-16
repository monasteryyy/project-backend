import { IsNumber, Min } from 'class-validator';

export class CreatePostulationDto {
  @IsNumber()
  @Min(1)
  userId!: number;

  @IsNumber()
  @Min(1)
  taskId!: number;
}
