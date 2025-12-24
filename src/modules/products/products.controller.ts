import { ProductFiltersEntity } from './entities/product-filters-data.entity';
import { Controller, Get, Query, SerializeOptions } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '@modules/auth/decorators/public.decorator';
import { PaginatedProductEntity } from './entities/paginated-product.entity';
import { Routes } from '@common/enums/routes';
import { FindAllProductsQueryDto } from './dto/find-all-products-query.dto';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@common/constants';

@ApiTags('Products')
@Controller(Routes.PRODUCTS)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @SerializeOptions({ type: PaginatedProductEntity })
  @Public()
  @Get()
  async findAll(
    @Query() query: FindAllProductsQueryDto,
  ): Promise<PaginatedProductEntity> {
    const {
      page = DEFAULT_PAGE,
      perPage = DEFAULT_PER_PAGE,
      sort_by,
      sort_order,
    } = query;

    return this.productsService.findAll({
      page,
      perPage,
      sortBy: sort_by,
      sortOrder: sort_order,
    });
  }

  @Public()
  @SerializeOptions({ type: ProductFiltersEntity })
  @Get(Routes.FILTERS)
  getProductsFiltersData(): Promise<ProductFiltersEntity> {
    return this.productsService.getProductsFiltersData();
  }
}
