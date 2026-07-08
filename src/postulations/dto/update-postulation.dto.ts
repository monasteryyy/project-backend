import { PartialType } from '@nestjs/mapped-types';
import { CreatePostulationDto } from './create-postulation.dto';
import { IsOptional, IsString, IsIn } from 'class-validator';

export class UpdatePostulationDto extends PartialType(CreatePostulationDto) {
  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'aceptada', 'rechazada', 'cancelada'])
  status?: string;
}