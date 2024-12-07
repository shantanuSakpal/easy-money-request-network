export interface RecipientType {
  id: string;
  name: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  description: string;
  amount: string;
  walletAddress: `0x${string}`;
  phone: string;
  taxRegistration: string;
  deductions: string;
  invoiceNumber: string;
}

export interface PayerType {
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  taxRegistration: string;
  walletAddress: `0x${string}`;
}
