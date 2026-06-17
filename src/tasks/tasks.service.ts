
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
    const validations = [
      {
        valid: createTaskDto.title.trim(),
        message: 'Title is required',
      },
      {
        valid: createTaskDto.description.trim(),
        message: 'Description is required',
      },
      {
        valid: createTaskDto.category.trim(),
        message: 'Category is required',
      },
      {
        valid: createTaskDto.location.trim(),
        message: 'Location is required',
      },
      {
        valid: Number.isFinite(createTaskDto.amount),
        message: 'Invalid amount',
      },
      {
        valid: createTaskDto.userId > 0,
        message: 'Invalid user',
      },
      {
        valid: createTaskDto.amount > 0,
        message: 'Amount must be greater than zero',
      },
      {
        valid: ['HOUR', 'DAY'].includes(createTaskDto.paymentType),
        message: 'Invalid payment type',
      },
    ];

    const failedValidation = validations.find(v => !v.valid);

    if (failedValidation) {
      throw new BadRequestException(failedValidation.message);
    }

    const task = {
      ...createTaskDto,
      title: createTaskDto.title.trim(),
      description: createTaskDto.description.trim(),
      category: createTaskDto.category.trim(),
      location: createTaskDto.location.trim(),
    };

    return this.prisma.task.create({
      data: task,
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
