import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService){}

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

  findAll(
    category?: string,
    location?: string,
    minAmount?: number,
) {
    return this.prisma.task.findMany({
      where: {
         category: category,
         location: location,
         amount: minAmount
          ?{
            gte: minAmount,
          }
          :undefined,
      }
    });
  }

  findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
    });
  }

  update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.prisma.task.update({
      where:{ id },
      data: updateTaskDto,
    });
  }

  remove(id: number) {
    return this.prisma.task.delete({
      where: { id },
    });
  }
}
