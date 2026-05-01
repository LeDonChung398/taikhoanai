import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { Country } from './entities/country.entity';

@Injectable()
export class CountriesService {
  constructor(
    @InjectRepository(Country)
    private readonly countriesRepository: Repository<Country>,
  ) {}

  async create(createCountryDto: CreateCountryDto): Promise<Country> {
    const existing = await this.countriesRepository.findOne({
      where: { name: createCountryDto.name },
    });

    if (existing) {
      throw new ConflictException('Country name already exists');
    }

    const country = this.countriesRepository.create(createCountryDto);
    return this.countriesRepository.save(country);
  }

  async findAll(): Promise<Country[]> {
    return this.countriesRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Country> {
    const country = await this.countriesRepository.findOne({ where: { id } });

    if (!country) {
      throw new NotFoundException('Country not found');
    }

    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto): Promise<Country> {
    const country = await this.findOne(id);
    Object.assign(country, updateCountryDto);
    return this.countriesRepository.save(country);
  }

  async remove(id: string): Promise<{ success: boolean }> {
    const country = await this.findOne(id);
    await this.countriesRepository.remove(country);
    return { success: true };
  }
}
