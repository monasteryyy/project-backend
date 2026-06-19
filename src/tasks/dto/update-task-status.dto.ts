import { IsIn } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsIn(['Creada', 'En Progreso', 'Finalizada', 'Cancelada'])
  status!: string;
}
