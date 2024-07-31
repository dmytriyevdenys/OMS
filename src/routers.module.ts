import { Module } from '@nestjs/common';
import { RouterModule } from '@nestjs/core';
import { OrdersModule } from './orders/orders.module';
import { OrderSourceModule } from './orders/order-source/order-source.module';
import { OrderStatusModule } from './orders/order-status/order-status.module';
import { PackerModule } from './packer/packer.module';
import { PaymentsModule } from './payments/payments.module';
import { ProductsModule } from './products/products.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    RouterModule.register([
      {
        path: 'order',
        module: OrdersModule,
        children: [
          {
            path: 'source',
            module: OrderSourceModule,
          },
          {
            path: 'status',
            module: OrderStatusModule,
          },
        ],
      },
      {
        path: 'packer',
        module: PackerModule,
      },
      {
        path: 'payments',
        module: PaymentsModule
      },
      {
        path: 'product',
        module: ProductsModule
      },
      {
        path: 'tasks',
        module: TasksModule
      },
      {
        path: 'user',
        module: UsersModule
      },
    ]),
  ],
})
export class RoutersModule {}
