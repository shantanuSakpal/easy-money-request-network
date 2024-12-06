import z from "zod";
import isEthereumAddress from "validator/lib/isEthereumAddress";
import { CURRENCY_ID } from "./currencies";

const CurrencyIdSchema = z.enum(
  Object.values(CURRENCY_ID) as [string, ...string[]]
);

const AddressSchema = z.object({
  "street-address": z.string().optional(),
  locality: z.string().optional(),
  region: z.string().optional(),
  "country-name": z.string().optional(),
  "postal-code": z.string().optional(),
});

const SellerInfoSchema = z.object({
  logo: z.string().url("Invalid seller logo").optional(),
  name: z
    .string()
    .min(2, "Seller name needs to be at least 2 characters")
    .optional(),
  email: z.string().email("Invalid email").optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  payerName: z.string().optional(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  taxRegistration: z.string().optional(),
  companyRegistration: z.string().optional(),
});

const BuyerInfoSchema = z.object({
  email: z.string().email("Invalid email").optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  payerName: z.string().optional(),
  phone: z.string().optional(),
  address: AddressSchema.optional(),
  taxRegistration: z.string().optional(),
  companyRegistration: z.string().optional(),
});

export const PropsValidation = z.object({
  sellerInfo: SellerInfoSchema.optional(),
  buyerInfo: BuyerInfoSchema.optional(),
  productInfo: z
    .object({
      name: z
        .string()
        .min(2, "Product name needs to be at least 2 characters")
        .optional(),
      image: z.string().url("Invalid product image").optional(),
      description: z.string().optional(),
    })
    .optional(),
  amountInUSD: z.number().gt(0, "Amount needs to be higher than 0").default(0),
  sellerAddress: z.string().refine(isEthereumAddress, "Invalid seller address"),
  supportedCurrencies: z
    .array(CurrencyIdSchema)
    .min(1, "At least one currency must be selected")
    .default([]),
  invoiceNumber: z.string().optional(),
  enableBuyerInfo: z.boolean().default(true),
  feeAddress: z
    .string()
    .refine(isEthereumAddress, "Invalid fee address")
    .optional()
    .nullable(),
  feeAmount: z
    .number()
    .gte(0, "Fee amount needs to be higher than 0")
    .default(0),
});
