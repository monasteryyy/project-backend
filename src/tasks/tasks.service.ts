import { Injectable } from '@nestjs/common';
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

  findAll(category?: string, location?: string, minAmount?: number) {
    return this.prisma.task.findMany({
      where: {
        category: category,
        location: location,
        amount: minAmount
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

  remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
