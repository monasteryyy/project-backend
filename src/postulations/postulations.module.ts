import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { PostulationsController } from './postulations.controller';
import { PostulationsService } from './postulations.service';

@Module({
  imports: [PrismaModule],
  controllers: [PostulationsController],
  providers: [PostulationsService],
})
export class PostulationsModule {}