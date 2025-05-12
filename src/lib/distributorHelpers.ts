import { Address, ContactInfo } from "@/types/distributor";

export const emptyAddress = (): Address => ({
  id: crypto.randomUUID(),
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
});

export const emptyContactInfo = (): ContactInfo => ({
  email: "",
  phone: "",
  website: "",
  contactName: "",
  contactRole: "",
});