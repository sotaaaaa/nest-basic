import { BuyerTagCreateDto, BuyerTagRemoveDto } from './dtos/buyer-tag.dto';
import { BuyerTagService } from './buyer-tag.service';
import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Transport } from '@nestjs/microservices';
import { EVENT_CONFIGS, ServiceToGateway } from '@skypos/common';
import { NatsPayload } from '@skypos/plugins';
import { QueryParse } from '@skypos/types';

@Controller()
export class BuyerTagController {
  constructor(private readonly buyerTagService: BuyerTagService) {}

  // Tạo mới một buyer tag
  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_TAG_CREATE, Transport.NATS)
  async createBuyerTag(@NatsPayload() dto: BuyerTagCreateDto) {
    Logger.log(`[createBuyerTag] Input dto`, dto);
    return this.buyerTagService.createBuyerTag(dto);
  }

  // Xóa một buyer tag
  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_TAG_DELETE, Transport.NATS)
  async deleteBuyerTag(@NatsPayload() dto: BuyerTagRemoveDto) {
    Logger.log(`[deleteBuyerTag] Input dto`, dto);
    return this.buyerTagService.deleteBuyerTag(dto);
  }

  // Lấy danh sách buyer tag
  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_TAG_GET_ALL, Transport.NATS)
  async getAllBuyerTags(@NatsPayload() query: QueryParse) {
    return this.buyerTagService.findForQuery(query);
  }
}
