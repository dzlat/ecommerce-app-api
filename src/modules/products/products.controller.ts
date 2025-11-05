import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  SerializeOptions,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/decorators/public.decorator';
import { PaginatedProductEntity } from './entities/paginated-product.entity';

const DEFAULT_PER_PAGE = 20;

@ApiTags('Products')
@SerializeOptions({ type: PaginatedProductEntity })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  @ApiQuery({ type: Number, name: 'page', required: false, default: 1 })
  @ApiQuery({
    type: Number,
    name: 'per_page',
    required: false,
    default: DEFAULT_PER_PAGE,
  })
  @ApiQuery({
    type: String,
    name: 'sort_by',
    required: false,
  })
  @ApiQuery({
    type: String,
    name: 'sort_order',
    required: false,
  })
  @ApiOkResponse({ type: PaginatedProductEntity, isArray: true })
  async findAll(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('per_page', ParseIntPipe) perPage: number = DEFAULT_PER_PAGE,
    @Query('sort_by') sortBy?: string,
    @Query('sort_order') sortOrder?: string,
  ) {
    return this.productsService.findAll({
      page,
      perPage,
      sortBy,
      sortOrder,
    });
  }
}
