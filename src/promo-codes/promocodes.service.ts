import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePromoCodeDto } from './dto/create-promo-code.dto';
import { UpdatePromoCodeDto } from './dto/update-promo-code.dto';
import { PromoCode } from './promo-code.entity';

@Injectable()
export class PromoCodesService {
  constructor(
    @InjectRepository(PromoCode)
    private readonly promoCodesRepository: Repository<PromoCode>,
  ) {}

  public async findPromoCodeById(promoCodeId: number) {
    const targetPromoCode = await this.promoCodesRepository.findOne({
      where: {
        id: promoCodeId,
      },
    });

    if (!targetPromoCode) {
      throw new NotFoundException('Promo Code not Found.');
    }

    return targetPromoCode;
  }

  public async findAllPromoCodes() {
    const allPromoCodes = await this.promoCodesRepository.find();
    return allPromoCodes;
  }

  public async createPromoCode(promoCodeData: CreatePromoCodeDto) {
    const targetPromoCode = await this.promoCodesRepository.findOne({
      where: {
        code: promoCodeData.code,
      },
    });

    if (targetPromoCode) {
      throw new NotFoundException('Promo is already Exists.');
    }

    const createdPromoCode = this.promoCodesRepository.create(promoCodeData);

    return await this.promoCodesRepository.save(createdPromoCode);
  }

  public async updatePromoCode(
    promoCodeId: number,
    promoCodeData: Partial<UpdatePromoCodeDto>,
  ) {
    const targetPromoCode = await this.promoCodesRepository.findOne({
      where: {
        id: promoCodeId,
      },
    });

    if (!targetPromoCode) {
      throw new NotFoundException('Promo Code not Found.');
    }

    const updatedPromoCode = Object.assign(targetPromoCode, promoCodeData);

    return await this.promoCodesRepository.save(updatedPromoCode);
  }

  public async deletePromoCode(promoCodeId: number) {
    const targetPromoCode = await this.promoCodesRepository.findOne({
      where: {
        id: promoCodeId,
      },
    });

    if (!targetPromoCode) {
      throw new NotFoundException('Promo Code not Found.');
    }

    return await this.promoCodesRepository.remove(targetPromoCode);
  }

  public async isValidPromoCode(promoCode: PromoCode) {
    const isValidPromoCode =
      promoCode.expirationDate.getDate() <= Date.now() &&
      promoCode.usageCount < promoCode.usageLimit &&
      promoCode.isActive === true;

    return isValidPromoCode;
  }

  public async findPromoCodeByCode(code: string) {
    const targetPromoCode = await this.promoCodesRepository.findOne({
      where: {
        code: code,
      },
    });

    if (!targetPromoCode) {
      throw new NotFoundException('Promo is Not Found.');
    }

    return targetPromoCode;
  }
}
