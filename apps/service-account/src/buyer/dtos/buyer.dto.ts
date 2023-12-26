import { BuyerGenders } from './../types/buyer.enum';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class BuyerCreateDto {
  @IsString()
  storeCode: string;

  @IsString()
  buyerFirstName: string;

  @IsString()
  buyerLastName: string;

  @IsOptional()
  @IsEmail()
  buyerEmail?: string;

  @IsOptional()
  @IsString()
  buyerPhone?: string;

  @IsOptional()
  @IsDateString()
  buyerBirthDate?: Date;

  @IsOptional()
  @IsEnum(BuyerGenders)
  buyerGender?: BuyerGenders;

  @IsOptional()
  @IsBoolean()
  isReceivePromotionalEmail?: boolean;

  @IsOptional()
  @IsString()
  deliveryAddress?: string;

  @IsOptional()
  @IsString()
  deliveryPhone?: string;

  @IsOptional()
  @IsString()
  deliveryProvinceCode?: string;

  @IsOptional()
  @IsString()
  deliveryDistrictCode?: string;

  @IsOptional()
  @IsString()
  deliveryWardCode?: string;

  @IsOptional()
  @IsString()
  additionalNote?: string;

  @IsOptional()
  @IsString({ each: true })
  buyerTagCodes?: string[];
}

export class BuyerUpdateDto extends PartialType(BuyerCreateDto) {
  @IsString()
  buyerCode: string;

  @IsString()
  storeCode: string;
}

export class BuyerGetProfileDto {
  @IsString()
  buyerCode: string;

  @IsString()
  storeCode: string;
}
