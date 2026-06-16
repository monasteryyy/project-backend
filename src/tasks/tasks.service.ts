import { Injectable, 
  BadRequestException,
  NotFoundException, } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  create(createTaskDto: CreateTaskDto) {
    return this.prisma.task.create({
      data: createTaskDto,
    });
  }

  findAll(category?: string, city?: string, minAmount?: number) {
    return this.prisma.task.findMany({
      where: {
        category: category,
        city: city,
        value: minAmount
          ? {
              gte: minAmount,
            }
          : undefined,
      },
    });
  }

  findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: updateTaskDto,
    });
  }

  async updateStatus(id: number, newStatus: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    this.validateTransition(task.status, newStatus);

    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: {
      status: newStatus,
      },
    });

    await this.prisma.taskHistory.create({
      data: {
      taskId: task.id,
      oldStatus: task.status,
      newStatus: newStatus,
      },
    });
       return updatedTask;
  }
  
  private validateTransition(
    current: string,
    next: string,
  ) {
    if (current === 'Finalizada') {
      throw new BadRequestException(
        'No se puede modificar una tarea finalizada',
      );
    }

    if (current === 'Cancelada') {
      throw new BadRequestException(
        'No se puede modificar una tarea cancelada',
      );
    }

    if (
      current === 'Creada' &&
      next === 'Finalizada'
    ) {
      throw new BadRequestException(
        'No se puede pasar de Creada a Finalizada directamente',
      );
    }
  }

  async getHistory(id: number) {
    return this.prisma.taskHistory.findMany({
      where: {
        taskId: id,
      },
      orderBy: {
        changedAt: 'desc',
      },
    });
  }





  remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
