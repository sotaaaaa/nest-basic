import { BuyerTrackingModule } from './../buyer-tracking/buyer-tracking.module';
import { BuyerDocument, BuyerSchema } from './schemas/buyer.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BuyerController } from './buyer.controller';
import { BuyerService } from './buyer.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: BuyerDocument.name, schema: BuyerSchema }],
      'DB_BUYER',
    ),
    BuyerTrackingModule,
  ],
  controllers: [BuyerController],
  providers: [BuyerService],
  exports: [BuyerService],
})
export class BuyerModule {}
