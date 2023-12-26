import { BuyerCreateDto, BuyerGetProfileDto, BuyerUpdateDto } from './dtos/buyer.dto';
import { BuyerService } from './buyer.service';
import { Controller, Logger } from '@nestjs/common';
import {
  EventPattern,
  MessagePattern,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { EVENT_CONFIGS, ServiceToGateway } from '@skypos/common';
import { KafkaPayload, NatsPayload } from '@skypos/plugins';
import { CreateOrderCompletedContext, QueryParse } from '@skypos/types';

@Controller()
export class BuyerController {
  constructor(private readonly buyerService: BuyerService) {}

  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_CREATE, Transport.NATS)
  async createBuyer(@NatsPayload() payload: BuyerCreateDto) {
    Logger.log('[createBuyer] Input payload', payload);
    return this.buyerService.create(payload);
  }

  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_UPDATE, Transport.NATS)
  async updateBuyer(@NatsPayload() payload: BuyerUpdateDto) {
    Logger.log('[updateBuyer] Input payload', payload);
    return this.buyerService.update(payload);
  }

  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_GET_PROFILE, Transport.NATS)
  async getBuyerProfile(@NatsPayload() payload: BuyerGetProfileDto) {
    const { buyerCode, storeCode } = payload || {};
    return this.buyerService.getProfileForSeller(buyerCode, storeCode);
  }

  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.BUYER_GET_ALL, Transport.NATS)
  async getAllBuyers(@NatsPayload() query: QueryParse) {
    return this.buyerService.findForQuery(query);
  }

  // Lấy thông tin của một buyer theo buyerCode
  @ServiceToGateway()
  @MessagePattern(EVENT_CONFIGS.SVC_BUYER.GET_BUYER_FOR_CODE, Transport.NATS)
  async getBuyerForCode(@NatsPayload() buyerCode: string) {
    return this.buyerService.getBuyerActive(buyerCode);
  }

  // Xử lý khi có order mới được tạo (Tracking buyer)
  @EventPattern(EVENT_CONFIGS.SVC_ORDER.ORDER_CREATE_COMPLETED, Transport.KAFKA)
  async handleCheckoutOrderCreate(@KafkaPayload() context: CreateOrderCompletedContext) {
    try {
      const result = await this.buyerService.handleContextNewOrder(context);
      Logger.log(`[handleCheckoutOrderCreate] Result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // Xử lý khi có order mới được xác nhận thanh toán (Tracking buyer)
  @EventPattern(EVENT_CONFIGS.SVC_ORDER.ORDER_PAYMENT_CONFIRMED, Transport.KAFKA)
  async handleCheckoutOrderPayment(@KafkaPayload() context: CreateOrderCompletedContext) {
    try {
      const result = await this.buyerService.handleContextOrderConfirmed(context);
      Logger.log(`[handleCheckoutOrderPayment] Result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }

  // Xử lý khi có order mới được huỷ (Tracking buyer)
  @EventPattern(EVENT_CONFIGS.SVC_ORDER.ORDER_CANCEL_CONFIRMED, Transport.KAFKA)
  async handleCheckoutOrderCancel(@KafkaPayload() context: CreateOrderCompletedContext) {
    try {
      const result = await this.buyerService.handleContextOrderCancelled(context);
      Logger.log(`[handleCheckoutOrderCancel] Result: ${JSON.stringify(result)}`);
      return result;
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
