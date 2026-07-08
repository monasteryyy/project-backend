import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostulationsService } from './postulations.service';
import { CreatePostulationDto } from './dto/create-postulation.dto';
import { UpdatePostulationDto } from './dto/update-postulation.dto';

@Controller('postulations')
export class PostulationsController {
  constructor(private readonly postulationsService: PostulationsService) {}

  @Post()
  create(@Body() createPostulationDto: CreatePostulationDto) {
    return this.postulationsService.create(createPostulationDto);
  }

  @Get()
  findAll(
    @Query('taskId') taskId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.postulationsService.findAll(
      taskId ? Number(taskId) : undefined,
      userId ? Number(userId) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postulationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostulationDto: UpdatePostulationDto,
  ) {
    return this.postulationsService.update(+id, updatePostulationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postulationsService.remove(+id);
  }
}