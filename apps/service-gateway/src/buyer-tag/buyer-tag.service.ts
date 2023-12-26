import { BuyerTagCreateDto, BuyerTagRemoveDto } from './dtos/buyer-tag.dto';
import { BuyerTagDocument } from './schemas/buyer-tag.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import randomColor from 'randomcolor';
import { QueryParse } from '@skypos/types';
import { ClientQuery } from '@skypos/common';

@Injectable()
export class BuyerTagService {
  constructor(
    @InjectModel(BuyerTagDocument.name)
    private readonly buyerTagModel: Model<BuyerTagDocument>,
  ) {}

  // Tạo mới buyer tag code
  private async createBuyerTagCode() {
    const count = await this.buyerTagModel.count();
    const originCode = `TAG${count + 1}`;
    const regex = /(\d+)/; // Tìm kiếm các số trong chuỗi
    const match = originCode.match(regex);
    if (!match) return originCode; // Nếu không tìm thấy số thì trả về chuỗi ban đầu

    const num = match[0].padStart(6, '0'); // Chuyển đổi số thành chuỗi với độ dài là 6 và đặt các số 0 đứng trước nếu cần
    return originCode.replace(regex, num); // Thay thế số cũ bằng số mới
  }

  // Tạo mới một buyer tag
  async createBuyerTag(dto: BuyerTagCreateDto) {
    const buyerTagCode = await this.createBuyerTagCode();
    const buyerTagColor = randomColor();
    const buyerTag = await this.buyerTagModel.create({
      ...dto,
      buyerTagCode,
      buyerTagColor,
    });

    Logger.log(`[BuyerTagService] Buyer tag created: ${buyerTagCode}`);
    return buyerTag;
  }

  // Xóa một buyer tag
  async deleteBuyerTag(dto: BuyerTagRemoveDto) {
    const { buyerTagCode, storeCode } = dto;
    const buyerTag = await this.buyerTagModel.findOneAndUpdate(
      { buyerTagCode, storeCode },
      { $set: { isDeleted: true } },
      { new: true },
    );

    Logger.log(`[BuyerTagService] Buyer tag deleted: ${buyerTagCode}`);
    return buyerTag;
  }

  // Lấy danh sách theo query
  async findForQuery(query: QueryParse) {
    const client = new ClientQuery(this.buyerTagModel);
    const result = await client.findForQuery(query);
    return result;
  }
}
