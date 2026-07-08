import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { UpdatePostulationDto } from './dto/update-postulation.dto';

@Injectable()
export class PostulationsService {
  constructor(private prisma: PrismaService) {}

  create(createPostulationDto: CreatePostulationDto) {
    return this.prisma.postulation.create({
      data: createPostulationDto,
    });
  }

findAll(taskId?: number, userId?: number) {
  const where: any = {};
  if (taskId) where.taskId = taskId;
  if (userId) where.userId = userId;

  return this.prisma.postulation.findMany({
    where,
    include: {
      user: true,
      task: true,
    },
  });
}
  findOne(id: number) {
    return this.prisma.postulation.findUnique({
      where: { id },
      include: {
        user: true,
        task: true,
      },
    });
  }

  update(id: number, updatePostulationDto: UpdatePostulationDto) {
    return this.prisma.postulation.update({
      where: { id },
      data: updatePostulationDto,
    });
  }

  remove(id: number) {
    return this.prisma.postulation.delete({
      where: { id },
    });
  }
}