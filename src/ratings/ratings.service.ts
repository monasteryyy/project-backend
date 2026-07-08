import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRatingDto } from './dto/create-rating.dto';

@Injectable()
export class RatingsService {
  constructor(private prisma: PrismaService) {}

  async create(createRatingDto: CreateRatingDto, senderUserId: number) {
    const { score, comments, taskId, receiverUserId } = createRatingDto;

    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!task) {
      throw new NotFoundException('Tarea no encontrada');
    }

    if (task.status !== 'Finalizada') {
      throw new BadRequestException('Solo se pueden calificar tareas finalizadas');
    }

    if (senderUserId === receiverUserId) {
      throw new BadRequestException('No puedes calificarte a ti mismo');
    }

    const existingRating = await this.prisma.rating.findUnique({
      where: { taskId },
    });

    if (existingRating) {
      throw new BadRequestException('Esta tarea ya ha sido calificada');
    }

    return this.prisma.rating.create({
      data: {
        score,
        comments,
        taskId,
        senderUserId,
        receiverUserId,
      },
    });
  }

  async findByUser(userId: number) {
    return this.prisma.rating.findMany({
      where: {
        receiverUserId: userId,
      },
      include: {
        senderUser: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getAverageRating(userId: number) {
    const ratings = await this.prisma.rating.findMany({
      where: {
        receiverUserId: userId,
      },
      select: {
        score: true,
      },
    });

    if (ratings.length === 0) {
      return { average: 0, count: 0 };
    }

    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    return {
      average: Number((total / ratings.length).toFixed(1)),
      count: ratings.length,
    };
  }
}