import { IsOptional, IsString } from 'class-validator';

export class BuyerTagCreateDto {
  @IsString()
  storeCode: string;

  @IsString()
  buyerTagName: string;

  @IsOptional()
  @IsString()
  buyerTagDescription?: string;

  @IsOptional()
  @IsString()
  buyerTagColor?: string;
}

export class BuyerTagRemoveDto {
  @IsString()
  storeCode: string;

  @IsString()
  buyerTagCode: string;
}
