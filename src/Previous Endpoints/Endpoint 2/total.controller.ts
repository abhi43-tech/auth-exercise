import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TotalService } from './total.service';
import { dateDto } from 'src/dto/date.dto';
import { ApiBody, ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('total')
export class TotalController {
  constructor(private readonly totalService: TotalService) {}

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiQuery({
    name: 'iso',
    description: 'Enter Country ISO code',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'from',
    description: 'Start date in YYYY-MM-DD format',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'to',
    description: 'End date in YYYY-MM-DD format',
    required: false,
    type: String,
  })
  getData(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('iso') iso?: string,
  ) {
    if (from && !this.isValidDate(from)) {
      throw new BadRequestException(
        'Invalid "from" date format. Use YYYY-MM-DD.',
      );
    }

    if (to && !this.isValidDate(to)) {
      throw new BadRequestException(
        'Invalid "to" date format. Use YYYY-MM-DD.',
      );
    }

    if (from && to && new Date(from) > new Date(to)) {
      throw new BadRequestException(
        '"from" date cannot be later than "to" date.',
      );
    }

    const date: dateDto = { from, to };
    if (date.from || date.to || iso)
      return this.totalService.getFilterData(date, iso);
    return this.totalService.getData();
  }

  private isValidDate(date: string): boolean {
    const regex = /^\d{4}-\d{1,2}-\d{2}$/;
    return regex.test(date);
  }
}
