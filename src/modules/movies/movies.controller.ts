import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  SerializeOptions,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from '@modules/auth/decorators/public.decorator';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { MovieEntity } from './entities/movie.entity';
import { Routes } from '@common/enums/routes';

@SerializeOptions({ type: MovieEntity })
@Controller(Routes.MOVIES)
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post()
  @Roles('ADMIN')
  @ApiCreatedResponse({ type: MovieEntity })
  @ApiBearerAuth()
  create(@Body() createMovieDto: CreateMovieDto) {
    return this.moviesService.create(createMovieDto);
  }

  @Public()
  @Get()
  @ApiOkResponse({ type: MovieEntity, isArray: true })
  findAll() {
    return this.moviesService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOkResponse({ type: MovieEntity })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: MovieEntity })
  @ApiBearerAuth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @ApiOkResponse({ type: MovieEntity })
  @ApiBearerAuth()
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.moviesService.remove(id);
  }
}
