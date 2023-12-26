import { BuyerTagDocument, BuyerTagSchema } from './schemas/buyer-tag.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { BuyerTagController } from './buyer-tag.controller';
import { BuyerTagService } from './buyer-tag.service';

@Module({
  imports: [
    MongooseModule.forFeature(
      [{ name: BuyerTagDocument.name, schema: BuyerTagSchema }],
      'DB_BUYER',
    ),
  ],
  controllers: [BuyerTagController],
  providers: [BuyerTagService],
})
export class BuyerTagModule {}
