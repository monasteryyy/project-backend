import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: {
            task: {
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should filter tasks by category', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    await service.findAll('Mascotas');

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: 'Mascotas',
        location: undefined,
        amount: undefined,
      },
    });
  });

  it('should filter tasks by location', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    await service.findAll(undefined, 'Bogotá');

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: undefined,
        location: 'Bogotá',
        amount: undefined,
      },
    });
  });
  it('should filter tasks by minimum amount', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    await service.findAll(undefined, undefined, 30);

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: undefined,
        location: undefined,
        amount: {
          gte: 30,
        },
      },
    });
  });

  it('should handle non-existing location filter', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    const result = await service.findAll(undefined, 'Antartida');

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: undefined,
        location: 'Antartida',
        amount: undefined,
      },
    });

    expect(result).toEqual([]);
  });

  it('should return empty result when category does not exist', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    const result = await service.findAll('CategoriaInexistente');

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: 'CategoriaInexistente',
        location: undefined,
        amount: undefined,
      },
    });

    expect(result).toEqual([]);
  });

  it('should return all tasks when no filters are provided', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    await service.findAll();

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: undefined,
        location: undefined,
        amount: undefined,
      },
    });
  });

  it('should apply multiple filters simultaneously', async () => {
    jest.spyOn(prismaService.task, 'findMany').mockResolvedValue([]);

    await service.findAll('Mascotas', 'Bogotá', 20);

    expect(prismaService.task.findMany).toHaveBeenCalledWith({
      where: {
        category: 'Mascotas',
        location: 'Bogotá',
        amount: {
          gte: 20,
        },
      },
    });
  });
});
