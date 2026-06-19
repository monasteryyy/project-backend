import { Test, TestingModule } from '@nestjs/testing';

import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { describe, beforeEach, it, expect, jest } from '@jest/globals'; // Importación correcta desde Jest
import { PrismaService } from '../prisma/prisma.service';

describe('TasksController', () => {
  let controller: TasksController;

  const prismaMock = {
    task: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: {
            // Define aquí mocks vacíos de los métodos que use tu controlador reales (ej. findAll, create)
            findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
            findOne: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});