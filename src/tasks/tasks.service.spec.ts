import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service'; 
import { describe, beforeEach, it, expect, jest } from '@jest/globals'; // <- Importación correcta desde Jest

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              findMany: jest.fn().mockImplementation(() => Promise.resolve([])),
              findUnique: jest.fn(),
              create: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    // Ahora sí queda correctamente dentro del bloque asignándose antes de cada test
    service = module.get<TasksService>(TasksService); 
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});