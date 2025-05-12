export type TabValue = "cadastro" | "endereco" | "contato";
export type FormStatus = "idle" | "submitting" | "success" | "error";
export type AddressType = "billing" | "delivery";

export interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website: string;
  contactName: string;
  contactRole: string;
}

export interface DistributorFormData {
  name: string;
  cnpj: string;
  billingAddress: Address;
  deliveryAddresses: Address[];
  contactInfo: ContactInfo;
}