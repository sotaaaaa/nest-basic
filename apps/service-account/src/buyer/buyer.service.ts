import { BuyerTrackingService } from './../buyer-tracking/buyer-tracking.service';
import { BuyerStatus } from './types/buyer.enum';
import { BuyerCreateDto, BuyerUpdateDto } from './dtos/buyer.dto';
import { BuyerDocument } from './schemas/buyer.schema';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import _ from 'lodash';
import assert from 'assert';
import { CreateOrderCompletedContext, QueryParse } from '@skypos/types';
import { ClientQuery } from '@skypos/common';

@Injectable()
export class BuyerService {
  constructor(
    @InjectModel(BuyerDocument.name)
    private readonly buyerModel: Model<BuyerDocument>,

    private readonly buyerTrackingService: BuyerTrackingService,
  ) {}

  // Hàm tạo ngẫu nhiên một mã buyer
  // Random từ 1000000 đến 9999999 và có ký tự đầu là P
  // Tìm kiếm trong bảng buyer nếu tồn tại sẽ tạo lại mã khác
  private async generateBuyerCode(): Promise<string> {
    let buyerCode: string;
    do {
      const random = _.random(1e6, 9e12);
      buyerCode = `B${random}`;
    } while (await this.buyerModel.findOne({ code: buyerCode }));

    return buyerCode;
  }

  /**
   * Tạo mới một buyer
   * @param dto
   * @returns
   */
  async create(dto: BuyerCreateDto) {
    const buyerCode = await this.generateBuyerCode();
    const buyerName = `${dto.buyerFirstName} ${dto.buyerLastName}`;

    // Tạo buyer và buyer tracking
    const [buyer, buyerTracking] = await Promise.all([
      this.buyerModel.create({ ...dto, buyerName, buyerCode }),
      this.buyerTrackingService.create(buyerCode, dto.storeCode),
    ]);

    Logger.log(`[BuyerService] Buyer created: ${buyerCode} - ${buyerTracking._id}`);
    return _.omit(buyer.toJSON(), ['__v']);
  }

  /**
   * Cập nhật thông tin buyer
   * @param dto
   */
  async update(dto: BuyerUpdateDto) {
    const buyer = await this.buyerModel.findOneAndUpdate(
      { buyerCode: dto.buyerCode, storeCode: dto.storeCode },
      { $set: _.omit(dto, ['buyerCode', 'storeCode']) },
      { new: true },
    );

    assert.ok(buyer, new NotFoundException("Buyer doesn't exist"));
    Logger.log(`[BuyerService] Buyer updated: ${dto.buyerCode}`);
    return _.omit(buyer.toJSON(), ['__v']);
  }

  // Lấy thông tin của một buyer theo buyerCode
  async getProfileForSeller(buyerCode: string, sellerCode: string) {
    const buyer = await this.buyerModel.findOne({ buyerCode, sellerCode });

    assert.ok(buyer, new NotFoundException("Buyer doesn't exist"));
    return _.omit(buyer.toJSON(), ['__v']);
  }

  // Lấy danh sách buyer và hỗ trợ client query
  async findForQuery(query: QueryParse) {
    const client = new ClientQuery(this.buyerModel);
    return client.findForQuery(query, {
      populate: {
        path: 'trackings',
        select: '-_id -__v -createdAt -updatedAt',
      },
    });
  }

  // Lấy thông tin buyer theo buyerCode
  async getBuyerActive(buyerCode: string) {
    const buyer = await this.buyerModel.findOne({
      buyerCode: buyerCode,
      status: BuyerStatus.ACTIVE,
    });

    assert.ok(buyer, new NotFoundException("Buyer doesn't exist"));
    return _.omit(buyer.toJSON(), ['__v']);
  }

  // Xử lý khi có order mới được tạo (Tracking buyer)
  // Nếu có thông tin địa chỉ giao hàng thì cập nhật vào buyer
  async handleContextNewOrder(context: CreateOrderCompletedContext) {
    // Cập nhật thông tin địa chỉ và số điện thoại của buyer
    const { storeCode, buyerCode } = context || {};
    const updateSetFields = {
      buyerAddress: context.buyerAddress,
      buyerPhone: context.buyerPhone,
      deliveryProvinceCode: context.buyerProvinceCode,
      deliveryDistrictCode: context.buyerDistrictCode,
      deliveryWardCode: context.buyerWardCode,
    };
    const buyerTracking = {
      buyerCode: buyerCode,
      storeCode: storeCode,
      lastOrderCode: context.orderCode,
      totalOrder: 1,
    };

    // Cập nhật thông tin buyer
    await Promise.all([
      this.buyerTrackingService.trackBuyer(buyerTracking),
      this.buyerModel.updateOne({ storeCode, buyerCode }, { $set: updateSetFields }),
    ]);

    Logger.log(`[handleContextNewOrder] Buyer tracked: ${buyerCode}`);
    return context;
  }

  // Xử lý khi có order mới được xác nhận thanh toán (Tracking buyer)
  // Nếu có thông tin địa chỉ giao hàng thì cập nhật vào buyer
  async handleContextOrderConfirmed(context: CreateOrderCompletedContext) {
    const { storeCode, buyerCode } = context || {};

    // Cập nhật thông tin buyer
    await this.buyerTrackingService.trackBuyer({
      buyerCode: buyerCode,
      storeCode: storeCode,
      totalAmount: context.totalAmount,
    });

    Logger.log(`[handleContextOrderConfirmed] Buyer tracked: ${buyerCode}`);
    return context;
  }

  // Xử lý khi có order mới được xác nhận huỷ (Tracking buyer)
  async handleContextOrderCancelled(context: CreateOrderCompletedContext) {
    const { storeCode, buyerCode } = context || {};

    // Cập nhật thông tin buyer
    await this.buyerTrackingService.trackBuyer({
      buyerCode: buyerCode,
      storeCode: storeCode,
      totalAmount: -context.totalAmount,
      totalOrder: -1,
    });

    Logger.log(`[handleContextOrderConfirmed] Buyer tracked: ${buyerCode}`);
    return context;
  }
}
