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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProductEntity } from './entities/product.entity';
import { Roles } from '@modules/auth/decorators/roles.decorator';
import { Public } from '@modules/auth/decorators/public.decorator';

@ApiTags('Products')
@SerializeOptions({ type: ProductEntity })
@Controller('movies/:movieId/products')
export class MovieProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Roles('ADMIN')
  @ApiCreatedResponse({ type: ProductEntity })
  @ApiBearerAuth()
  create(
    @Param('movieId', ParseUUIDPipe) movieId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(movieId, createProductDto);
  }

  @Public()
  @Get()
  @ApiOkResponse({ type: ProductEntity, isArray: true })
  findAll(@Param('movieId', ParseUUIDPipe) movieId: string) {
    return this.productsService.findAllByMovie(movieId);
  }

  @Patch(':productId')
  @Roles('ADMIN')
  @ApiOkResponse({ type: ProductEntity })
  @ApiBearerAuth()
  update(
    @Param('movieId', ParseUUIDPipe) movieId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(movieId, productId, updateProductDto);
  }

  @Delete(':productId')
  @Roles('ADMIN')
  @ApiOkResponse({ type: ProductEntity })
  @ApiBearerAuth()
  remove(
    @Param('movieId', ParseUUIDPipe) movieId: string,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.productsService.remove(movieId, productId);
  }
}
