import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { CountriesService } from './country.service';
import { ApiQuery } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard/jwt.guard';

@UseGuards(JwtGuard)
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @ApiQuery({
    name: 'name',
    description: 'Enter Country Name',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'code',
    description: 'Enter Country Code',
    required: false,
    type: String,
  })
  getCountries(@Query('name') name?: string, @Query('code') code?: string) {
    return this.countriesService.getCountries(name, code);
  }
}
