import { Test, TestingModule } from '@nestjs/testing';

import { TasksService } from './tasks.service';
import { PrismaService } from '../prisma/prisma.service';

describe('TasksService', () => {
  let service: TasksService;

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
      providers: [
        TasksService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  const validTask = {
    title: ' Walk the dog ',
    description: ' One hour walk ',
    category: ' Pets ',
    location: ' Bogotá ',
    paymentType: 'HOUR',
    amount: 20,
    userId: 1,
  };
  const cases = [
    {
      name: 'User publishes a pet walking task',
      dto: {
        title: ' Walk the dog ',
        description: ' One hour walk ',
        category: ' Pets ',
        location: ' Bogotá ',
        paymentType: 'HOUR',
        amount: 20,
        userId: 1,
      },
      shouldThrow: false,
    },

    {
      name: 'User publishes a house cleaning task',
      dto: {
        title: ' Clean the house ',
        description: ' Deep cleaning ',
        category: ' Home ',
        location: ' Medellín ',
        paymentType: 'DAY',
        amount: 150,
        userId: 2,
      },
      shouldThrow: false,
    },

    {
      name: 'User enters amount equal to zero',
      dto: {
        title: 'Move furniture',
        description: 'Second floor',
        category: 'Moving',
        location: 'Cali',
        paymentType: 'DAY',
        amount: 0,
        userId: 1,
      },
      shouldThrow: true,
      message: 'Amount must be greater than zero',
    },

    {
      name: 'User enters negative amount',
      dto: {
        title: 'Paint wall',
        description: 'Bedroom',
        category: 'Home',
        location: 'Bogotá',
        paymentType: 'DAY',
        amount: -50,
        userId: 1,
      },
      shouldThrow: true,
      message: 'Amount must be greater than zero',
    },

    {
      name: 'User enters invalid payment type',
      dto: {
        title: 'Repair laptop',
        description: 'Gaming laptop',
        category: 'Technology',
        location: 'Bogotá',
        paymentType: 'MONTH',
        amount: 100,
        userId: 1,
      },
      shouldThrow: true,
      message: 'Invalid payment type',
    },

    {
      name: 'User enters decimal payment amount',
      dto: {
        title: 'Translate document',
        description: 'English to Spanish',
        category: 'Languages',
        location: 'Remote',
        paymentType: 'HOUR',
        amount: 18.5,
        userId: 4,
      },
      shouldThrow: false,
    },

    {
      name: 'User enters very large payment amount',
      dto: {
        title: 'Develop mobile application',
        description: 'Flutter app',
        category: 'Software',
        location: 'Remote',
        paymentType: 'DAY',
        amount: 999999,
        userId: 5,
      },
      shouldThrow: false,
    },
    {
      name: 'User submits a blank title',
      dto: {
        title: '     ',
        description: 'Need help moving furniture',
        category: 'Moving',
        location: 'Bogotá',
        paymentType: 'DAY',
        amount: 80,
        userId: 1,
      },
      shouldThrow: true,
      message: 'Title is required',
    },
    {
      name: 'User submits an empty description',
      dto: {
        title: 'Paint my room',
        description: '      ',
        category: 'Home',
        location: 'Bogotá',
        paymentType: 'DAY',
        amount: 120,
        userId: 1,
      },
      shouldThrow: true,
      message: 'Description is required',
    },
    {
      name: 'empty title',
      dto: {
        ...validTask,
        title: '   ',
      },
      shouldThrow: true,
      message: 'Title is required',
    },
    {
      name: 'empty description',
      dto: {
        ...validTask,
        description: '',
      },
      shouldThrow: true,
      message: 'Description is required',
    },
    {
      name: 'empty category',
      dto: {
        ...validTask,
        category: '',
      },
      shouldThrow: true,
      message: 'Category is required',
    },
    {
      name: 'invalid user id',
      dto: {
        ...validTask,
        userId: 0,
      },
      shouldThrow: true,
      message: 'Invalid user',
    },
    {
      name: 'negative user id',
      dto: {
        ...validTask,
        userId: -5,
      },
      shouldThrow: true,
      message: 'Invalid user',
    },
    {
      name: 'empty category with spaces',
      dto: {
        ...validTask,
        category: '      ',
      },
      shouldThrow: true,
      message: 'Category is required',
    },
    {
      name: 'empty location',
      dto: {
        ...validTask,
        location: '',
      },
      shouldThrow: true,
      message: 'Location is required',
    },
    {
      name: 'amount is NaN',
      dto: {
        ...validTask,
        amount: Number.NaN,
      },
      shouldThrow: true,
      message: 'Invalid amount',
    },
    {
      name: 'amount is Infinity',
      dto: {
        ...validTask,
        amount: Number.POSITIVE_INFINITY,
      },
      shouldThrow: true,
      message: 'Invalid amount',
    },
  ];

  it.each(cases)('$name', async (testCase) => {
    jest.clearAllMocks();

    console.log(testCase.name, testCase.shouldThrow);

    if (!testCase.shouldThrow) {
      prismaMock.task.create.mockResolvedValue({
        ...testCase.dto,
        title: testCase.dto.title.trim(),
        description: testCase.dto.description.trim(),
        category: testCase.dto.category.trim(),
        location: testCase.dto.location.trim(),
      });

      const result = await service.create(testCase.dto);

      expect(prismaMock.task.create).toHaveBeenCalledWith({
        data: {
          ...testCase.dto,
          title: testCase.dto.title.trim(),
          description: testCase.dto.description.trim(),
          category: testCase.dto.category.trim(),
          location: testCase.dto.location.trim(),
        },
      });

      expect(result).toEqual({
        ...testCase.dto,
        title: testCase.dto.title.trim(),
        description: testCase.dto.description.trim(),
        category: testCase.dto.category.trim(),
        location: testCase.dto.location.trim(),
      });
    } else {
      expect(() => service.create(testCase.dto)).toThrow(testCase.message);

      expect(prismaMock.task.create).not.toHaveBeenCalled();
    }
  });
});
