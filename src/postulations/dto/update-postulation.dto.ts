import { PartialType } from '@nestjs/mapped-types';
import { CreatePostulationDto } from './create-postulation.dto';

export class UpdatePostulationDto extends PartialType(CreatePostulationDto) {}
