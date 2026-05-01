import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriesService } from '../categories/categories.service';
import { CountriesService } from '../countries/countries.service';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly countriesService: CountriesService,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const existing = await this.productsRepository.findOne({
      where: { slug: createProductDto.slug },
    });

    if (existing) {
      throw new ConflictException('Product slug already exists');
    }

    await this.categoriesService.findOne(createProductDto.categoryId);
    await this.countriesService.findOne(createProductDto.countryId);

    const product = this.productsRepository.create({
      ...createProductDto,
      soldQuantity: createProductDto.soldQuantity ?? 0,
    });

    return this.productsRepository.save(product);
  }

  async findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { slug } });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.slug && updateProductDto.slug !== product.slug) {
      const existing = await this.productsRepository.findOne({
        where: { slug: updateProductDto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Product slug already exists');
      }
    }

    if (updateProductDto.categoryId) {
      await this.categoriesService.findOne(updateProductDto.categoryId);
    }

    if (updateProductDto.countryId) {
      await this.countriesService.findOne(updateProductDto.countryId);
    }

    Object.assign(product, updateProductDto);
    return this.productsRepository.save(product);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const product = await this.findOne(id);
    await this.productsRepository.remove(product);
    return { success: true };
  }
}
