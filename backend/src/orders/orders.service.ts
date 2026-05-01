import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import {
  UserTransaction,
  UserTransactionType,
} from '../users/entities/user-transaction.entity';
import { User } from '../users/entities/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    return this.dataSource.transaction(async (manager) => {
      const user = await manager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User not found: ${userId}`);
      }

      const items: OrderItem[] = [];
      let totalAmount = 0;

      for (const itemDto of createOrderDto.items) {
        const product = await manager.findOne(Product, {
          where: { id: itemDto.productId },
        });

        if (!product) {
          throw new NotFoundException(`Product not found: ${itemDto.productId}`);
        }

        if (itemDto.quantity < product.minPurchaseQuantity) {
          throw new BadRequestException(
            `Product ${product.name} requires minimum purchase quantity ${product.minPurchaseQuantity}`,
          );
        }

        if (itemDto.quantity > product.stockQuantity) {
          throw new BadRequestException(
            `Insufficient stock for ${product.name}. Available: ${product.stockQuantity}`,
          );
        }

        const lineTotal = product.price * itemDto.quantity;

        product.stockQuantity -= itemDto.quantity;
        product.soldQuantity += itemDto.quantity;
        await manager.save(product);

        const orderItem = manager.create(OrderItem, {
          product,
          productId: product.id,
          quantity: itemDto.quantity,
          unitPrice: product.price,
          lineTotal,
        });

        items.push(orderItem);
        totalAmount += lineTotal;
      }

      if (user.balance < totalAmount) {
        throw new BadRequestException('Insufficient balance for this order');
      }

      user.balance -= totalAmount;
      await manager.save(user);

      const order = manager.create(Order, {
        userId,
        totalAmount,
        items,
      });

      const savedOrder = await manager.save(order);

      const transaction = manager.create(UserTransaction, {
        userId,
        type: UserTransactionType.DEBIT,
        amount: totalAmount,
        reason: `Thanh toan don hang #${savedOrder.id.slice(0, 8).toUpperCase()}`,
      });
      await manager.save(transaction);

      return savedOrder;
    });
  }

  async findAll(): Promise<Order[]> {
    return this.ordersRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findMine(userId: string): Promise<Order[]> {
    return this.ordersRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.ordersRepository.findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderDto.status;
    return this.ordersRepository.save(order);
  }
}
