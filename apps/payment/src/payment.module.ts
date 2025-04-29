import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentEvents } from './payment.events';

@Module({
  controllers: [PaymentController, PaymentEvents],
  providers: [PaymentService],
})
export class PaymentModule {}
