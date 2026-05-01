import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { Category } from './categories/entities/category.entity';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ContactsModule } from './contacts/contacts.module';
import { Contact } from './contacts/entities/contact.entity';
import { CountriesModule } from './countries/countries.module';
import { Country } from './countries/entities/country.entity';
import { DepositRequestsModule } from './deposit-requests/deposit-requests.module';
import { DepositRequest } from './deposit-requests/entities/deposit-request.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderItem } from './orders/entities/order-item.entity';
import { Order } from './orders/entities/order.entity';
import { PaymentInfoModule } from './payment-info/payment-info.module';
import { PaymentInfo } from './payment-info/entities/payment-info.entity';
import { ProductsModule } from './products/products.module';
import { Product } from './products/entities/product.entity';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';
import { Role } from './users/entities/role.entity';
import { UserTransaction } from './users/entities/user-transaction.entity';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbPort = Number.parseInt(
          configService.get<string>('DB_PORT', '5432'),
          10,
        );

        return {
          type: 'postgres' as const,
          host: configService.get<string>('DB_HOST', 'localhost'),
          port: Number.isNaN(dbPort) ? 5432 : dbPort,
          username: configService.get<string>('DB_USERNAME', 'postgres'),
          password: configService.get<string>('DB_PASSWORD', 'postgres'),
          database: configService.get<string>('DB_NAME', 'taikhoanai'),
          entities: [
            Role,
            User,
            UserTransaction,
            Country,
            Contact,
            Category,
            Product,
            PaymentInfo,
            Order,
            OrderItem,
            DepositRequest,
          ],
          synchronize: configService.get<string>('DB_SYNC', 'true') === 'true',
          logging: configService.get<string>('DB_LOGGING', 'false') === 'true',
        };
      },
    }),
    AuthModule,
    UsersModule,
    DepositRequestsModule,
    CountriesModule,
    ContactsModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentInfoModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
