import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Injectable } from '@nestjs/common';
import {
  SELECT_COUPON_TEMPLATE,
  SelectCouponTemplate,
} from './model/prisma-type/select-coupon-template';
import { CreateCouponTemplateInput } from './inputs/create-coupon-template.input';
import { UpdateCouponTemplateInput } from './inputs/update-coupon-template.input';

@Injectable()
export class CouponTemplateCoreRepository {
  constructor(
    private readonly txHost: TransactionHost<TransactionalAdapterPrisma>,
  ) {}

  public async getCouponTemplateAllByPlaceIdx(
    placeIdx: number,
  ): Promise<SelectCouponTemplate[]> {
    return this.txHost.tx.couponTemplate.findMany({
      ...SELECT_COUPON_TEMPLATE,
      where: { placeIdx, deletedAt: null },
    });
  }

  public async insertCouponTemplate(
    input: CreateCouponTemplateInput,
  ): Promise<SelectCouponTemplate> {
    return this.txHost.tx.couponTemplate.create({
      ...SELECT_COUPON_TEMPLATE,
      data: {
        placeIdx: input.placeIdx,
        description: input.description,
        imagePath: input.imagePath,
        fixedDiscount: input.fixedDiscount
          ? {
              create: {
                menuName: input.fixedDiscount.menuName,
                price: input.fixedDiscount.price,
              },
            }
          : undefined,
        percentDiscount: input.percentDiscount
          ? {
              create: {
                menuName: input.percentDiscount.menuName,
                percent: input.percentDiscount.percent,
                maxPrice: input.percentDiscount.maxPrice,
              },
            }
          : undefined,
        variant: input.variant
          ? {
              create: {
                name: input.variant.name,
              },
            }
          : undefined,
      },
    });
  }

  public async updateCouponTemplateById(
    id: string,
    input: UpdateCouponTemplateInput,
  ): Promise<void> {
    await this.txHost.tx.couponTemplate.update({
      where: { id },
      data: {
        description: input.description,
        imagePath: input.imagePath,
        fixedDiscount: input.fixedDiscount
          ? {
              update: {
                menuName: input.fixedDiscount.menuName,
                price: input.fixedDiscount.price,
              },
            }
          : undefined,
        percentDiscount: input.percentDiscount
          ? {
              update: {
                menuName: input.percentDiscount.menuName,
                percent: input.percentDiscount.percent,
                maxPrice: input.percentDiscount.maxPrice,
              },
            }
          : undefined,
        variant: input.variant
          ? {
              update: {
                name: input.variant.name,
              },
            }
          : undefined,
      },
    });
  }
}
