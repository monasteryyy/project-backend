import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
    await this.ensureRoles();
  }

  private async ensureRoles() {
    try {
      const roles = ['ADMIN', 'USER'];
      for (const roleName of roles) {
        await this.role.upsert({
          where: { roleName },
          update: {},
          create: { roleName },
        });
      }
      console.log('✅ Roles asegurados en la base de datos');
    } catch (error) {
      console.error('❌ Error al asegurar roles:', error);
    }
  }
}