import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreatePromoCodeDto } from "./dto/create-promo-code.dto";
import { GetAllPromoCodesQueryParamsDto } from "./dto/get-all-promo-codes-query-params.dto";
import { UpdatePromoCodeDto } from "./dto/update-promo-code.dto";
import { PromoCode } from "./promo-code.entity";

@Injectable()
export class PromoCodesService {
	constructor(
		@InjectRepository(PromoCode)
		private readonly promoCodesRepository: Repository<PromoCode>
	) {}

	public async findPromoCodeById(promoCodeId: number) {
		const targetPromoCode = await this.promoCodesRepository.findOne({
			where: {
				id: promoCodeId,
			},
		});

		if (!targetPromoCode) {
			throw new NotFoundException("Promo Code not Found.");
		}

		return targetPromoCode;
	}

	public async findAllPromoCodes(queryParams: GetAllPromoCodesQueryParamsDto) {
		const promoCodesQueryBuilder =
			this.promoCodesRepository.createQueryBuilder("promo_codes");

		if (String(queryParams.active) === "true") {
			promoCodesQueryBuilder.where("promo_codes.isActive = :activeValue", {
				activeValue: queryParams.active,
			});
		}

		if (String(queryParams.active) === "false") {
			promoCodesQueryBuilder.where("promo_codes.isActive = :activeValue", {
				activeValue: queryParams.active,
			});
		}

		if (queryParams.sortBy) {
			promoCodesQueryBuilder.orderBy(
				`promo_codes.${queryParams.sortBy}`,
				queryParams.order || "ASC"
			);
		}

		return await promoCodesQueryBuilder.getMany();
	}

	public async createPromoCode(promoCodeData: CreatePromoCodeDto) {
		const targetPromoCode = await this.promoCodesRepository.findOne({
			where: {
				code: promoCodeData.code,
			},
		});

		if (targetPromoCode) {
			throw new NotFoundException("Promo Code is already Exists.");
		}

		const createdPromoCode = this.promoCodesRepository.create(promoCodeData);

		return await this.promoCodesRepository.save(createdPromoCode);
	}

	public async updatePromoCode(
		promoCodeId: number,
		promoCodeData: Partial<UpdatePromoCodeDto>
	) {
		const targetPromoCode = await this.promoCodesRepository.findOne({
			where: {
				id: promoCodeId,
			},
		});

		if (!targetPromoCode) {
			throw new NotFoundException("Promo Code not Found.");
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
			throw new NotFoundException("Promo Code not Found.");
		}

		return;
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
			throw new NotFoundException("Promo is Not Found.");
		}

		return targetPromoCode;
	}

	public async clearAllNonActivePromoCodes() {
		const allNonActivePromoCodes = await this.promoCodesRepository
			.createQueryBuilder("promo_codes")
			.where("promo_codes.isActive = false")
			.orWhere("promo_codes.usageLimit <= promo_codes.usageCount")
			.getMany();

		if (allNonActivePromoCodes.length <= 0) {
			return;
		}

		for (const promoCode of allNonActivePromoCodes) {
			await this.promoCodesRepository.remove(promoCode);
		}

		return;
	}
}
