import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ratings')
export class RatingsController {
  constructor(private readonly ratingsService: RatingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Request() req: any, @Body() createRatingDto: CreateRatingDto) {
    const senderUserId = req.user?.id || req.user?.sub;
    return this.ratingsService.create(createRatingDto, senderUserId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.ratingsService.findByUser(+userId);
  }

  @Get('user/:userId/average')
  getAverageRating(@Param('userId') userId: string) {
    return this.ratingsService.getAverageRating(+userId);
  }
}