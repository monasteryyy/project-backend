import { IsInt, IsOptional, IsString, Max, Min, Length } from 'class-validator';

export class CreateRatingDto {
  @IsInt()
  @Min(1)
  @Max(5)
  score: number;

  @IsOptional()
  @IsString()
  @Length(0, 300)
  comments?: string;

  @IsInt()
  taskId: number;

  @IsInt()
  receiverUserId: number;
}