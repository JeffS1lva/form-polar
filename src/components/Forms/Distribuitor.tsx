"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, MapPin, FileText, Plus, Building, Truck, Phone, Mail, UserRound, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

type FormStatus = "idle" | "submitting" | "success" | "error";
type AddressType = "billing" | "delivery";
type TabValue = "cadastro" | "endereco" | "contato";
type CnpjStatus = "idle" | "loading" | "valid" | "invalid";

interface Address {
  id: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
}

interface AddressData {
  erro: any;
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  website: string;
  contactName: string;
  contactRole: string;
}

interface CnpjData {
  nome: string;
  fantasia: string;
  email: string;
  telefone: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  situacao: string;
  erro?: string;
}

interface DistributorFormData {
  name: string;
  cnpj: string;
  billingAddress: Address;
  deliveryAddresses: Address[];
  contactInfo: ContactInfo;
}

const emptyAddress = (): Address => ({
  id: crypto.randomUUID(),
  cep: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
});

const emptyContactInfo = (): ContactInfo => ({
  email: "",
  phone: "",
  website: "",
  contactName: "",
  contactRole: "",
});

const distributorFormFields = [
  {
    name: "name",
    label: "Nome",
    placeholder: "Nome do Distribuidor",
    type: "text",
    section: "main",
  },
  {
    name: "cnpj",
    label: "CNPJ",
    placeholder: "CNPJ do Distribuidor",
    type: "text",
    section: "main",
  },
];

const addressFields = [
  {
    name: "cep",
    label: "CEP",
    placeholder: "Digite o CEP",
    type: "text",
  },
  {
    name: "street",
    label: "Logradouro",
    placeholder: "Rua, Avenida, etc.",
    type: "text",
  },
  {
    name: "number",
    label: "Número",
    placeholder: "Número",
    type: "text",
  },
  {
    name: "neighborhood",
    label: "Bairro",
    placeholder: "Bairro",
    type: "text",
  },
  {
    name: "city",
    label: "Cidade",
    placeholder: "Cidade",
    type: "text",
  },
  {
    name: "state",
    label: "Estado",
    placeholder: "UF",
    type: "text",
  },
];

const contactFields = [
  {
    name: "email",
    label: "Email",
    placeholder: "Email do Distribuidor",
    type: "email",
  },
  {
    name: "phone",
    label: "Telefone",
    placeholder: "Telefone do Distribuidor",
    type: "tel",
  },
  {
    name: "website",
    label: "Website",
    placeholder: "Website do Distribuidor",
    type: "url",
  },
  {
    name: "contactName",
    label: "Nome do Contato",
    placeholder: "Nome da pessoa de contato",
    type: "text",
  },
  {
    name: "contactRole",
    label: "Cargo do Contato", 
    placeholder: "Cargo da pessoa de contato",
    type: "text",
  },
];

// Função para formatar CNPJ
const formatCnpj = (value: string) => {
  const cnpjDigits = value.replace(/\D/g, "");
  if (cnpjDigits.length <= 2) return cnpjDigits;
  if (cnpjDigits.length <= 5) return `${cnpjDigits.slice(0, 2)}.${cnpjDigits.slice(2)}`;
  if (cnpjDigits.length <= 8) return `${cnpjDigits.slice(0, 2)}.${cnpjDigits.slice(2, 5)}.${cnpjDigits.slice(5)}`;
  if (cnpjDigits.length <= 12) return `${cnpjDigits.slice(0, 2)}.${cnpjDigits.slice(2, 5)}.${cnpjDigits.slice(5, 8)}/${cnpjDigits.slice(8)}`;
  return `${cnpjDigits.slice(0, 2)}.${cnpjDigits.slice(2, 5)}.${cnpjDigits.slice(5, 8)}/${cnpjDigits.slice(8, 12)}-${cnpjDigits.slice(12, 14)}`;
};

// Função para formatar somente números do CNPJ
const unformatCnpj = (value: string) => value.replace(/\D/g, "");

export default function DistributorForm() {
  const [activeTab, setActiveTab] = useState<TabValue>("cadastro");
  const [distributorForm, setDistributorForm] = useState<DistributorFormData>({
    name: "",
    cnpj: "",
    billingAddress: emptyAddress(),
    deliveryAddresses: [emptyAddress()],
    contactInfo: emptyContactInfo(),
  });

  const [formStatus, setFormStatus] = useState<FormStatus>("idle");
  const [isLoadingCep, setIsLoadingCep] = useState<Record<string, boolean>>({});
  const [cepErrors, setCepErrors] = useState<Record<string, string>>({});
  const [cnpjStatus, setCnpjStatus] = useState<CnpjStatus>("idle");
  const [cnpjError, setCnpjError] = useState<string>("");
  const [displayCnpj, setDisplayCnpj] = useState<string>("");

  // Efeito para formatar o CNPJ na exibição
  useEffect(() => {
    setDisplayCnpj(formatCnpj(distributorForm.cnpj));
  }, [distributorForm.cnpj]);

  // Check if cadastro section is filled and change to endereco tab


  // Check if endereco section is filled and change to contato tab
  useEffect(() => {
    if (activeTab === "endereco") {
      const billingFilled = distributorForm.billingAddress.cep && 
                          distributorForm.billingAddress.street && 
                          distributorForm.billingAddress.number &&
                          distributorForm.billingAddress.city &&
                          distributorForm.billingAddress.state;
      
      // Verifica se pelo menos o primeiro endereço de entrega está preenchido
      const deliveryFilled = distributorForm.deliveryAddresses.length > 0 && 
                            distributorForm.deliveryAddresses[0].cep &&
                            distributorForm.deliveryAddresses[0].street &&
                            distributorForm.deliveryAddresses[0].number &&
                            distributorForm.deliveryAddresses[0].city &&
                            distributorForm.deliveryAddresses[0].state;
      
      if (billingFilled && deliveryFilled) {
        const timer = setTimeout(() => {
          setActiveTab("contato");
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [distributorForm.billingAddress, distributorForm.deliveryAddresses, activeTab]);

  const fetchAddressByCep = async (cep: string, addressId: string, type: AddressType) => {
    if (!cep || cep.length !== 8) {
      return;
    }

    setIsLoadingCep(prev => ({ ...prev, [addressId]: true }));
    setCepErrors(prev => ({ ...prev, [addressId]: "" }));

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data: AddressData = await response.json();

      if (data.erro) {
        setCepErrors(prev => ({ ...prev, [addressId]: "CEP não encontrado" }));
        return;
      }

      setDistributorForm(prev => {
        if (type === "billing") {
          return {
            ...prev,
            billingAddress: {
              ...prev.billingAddress,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            }
          };
        } else {
          const updatedAddresses = prev.deliveryAddresses.map(addr => 
            addr.id === addressId ? {
              ...addr,
              street: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf,
            } : addr
          );
          return {
            ...prev,
            deliveryAddresses: updatedAddresses
          };
        }
      });
    } catch (error) {
      setCepErrors(prev => ({ ...prev, [addressId]: "Erro ao buscar CEP" }));
    } finally {
      setIsLoadingCep(prev => ({ ...prev, [addressId]: false }));
    }
  };

  const fetchCnpjData = async (cnpj: string) => {
    if (!cnpj || cnpj.length !== 14) {
      return;
    }

    setCnpjStatus("loading");
    setCnpjError("");

    try {
      // Usando a API do CNPJWS
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`);
      const data = await response.json();

      if (data.erro) {
        setCnpjError(data.erro);
        setCnpjStatus("invalid");
        return;
      }

      // Processando os dados retornados pela API
      const cnpjData: CnpjData = {
        nome: data.razao_social || "",
        fantasia: data.estabelecimento?.nome_fantasia || "",
        email: data.estabelecimento?.email || "",
        telefone: data.estabelecimento?.ddd1 && data.estabelecimento?.telefone1 
                ? `(${data.estabelecimento.ddd1}) ${data.estabelecimento.telefone1}` 
                : "",
        logradouro: data.estabelecimento?.tipo_logradouro 
                  ? `${data.estabelecimento.tipo_logradouro} ${data.estabelecimento.logradouro}` 
                  : data.estabelecimento?.logradouro || "",
        numero: data.estabelecimento?.numero || "",
        complemento: data.estabelecimento?.complemento || "",
        bairro: data.estabelecimento?.bairro || "",
        cidade: data.estabelecimento?.cidade?.nome || "",
        uf: data.estabelecimento?.estado?.sigla || "",
        cep: data.estabelecimento?.cep 
            ? data.estabelecimento.cep.replace(/\D/g, "") 
            : "",
        situacao: data.estabelecimento?.situacao_cadastral || ""
      };

      // Atualizando os dados no formulário
      // Atualizando os dados no formulário
setDistributorForm(prev => {
  const updatedForm = {
    ...prev,
    name: cnpjData.nome,
    billingAddress: {
      ...prev.billingAddress,
      cep: cnpjData.cep,
      street: cnpjData.logradouro,
      number: cnpjData.numero,
      neighborhood: cnpjData.bairro,
      city: cnpjData.cidade,
      state: cnpjData.uf,
    },
    contactInfo: {
      ...prev.contactInfo,
      email: cnpjData.email,
      phone: cnpjData.telefone,
    }
  };

  // If the delivery address is empty, fill with the same data
  if (!prev.deliveryAddresses[0].street) {
    updatedForm.deliveryAddresses = [
      {
        ...prev.deliveryAddresses[0],
        cep: cnpjData.cep,
        street: cnpjData.logradouro,
        number: cnpjData.numero,
        neighborhood: cnpjData.bairro,
        city: cnpjData.cidade,
        state: cnpjData.uf,
      },
      ...prev.deliveryAddresses.slice(1)
    ];
  }

  return updatedForm;
});
      // Verificando situação cadastral
      if (cnpjData.situacao !== "ATIVA") {
        setCnpjError(`CNPJ com situação cadastral: ${cnpjData.situacao}`);
        setCnpjStatus("invalid");
        return;
      }

      setCnpjStatus("valid");
    } catch (error) {
      console.error("Erro ao consultar CNPJ:", error);
      setCnpjError("Erro ao consultar CNPJ. Verifique sua conexão ou tente novamente mais tarde.");
      setCnpjStatus("invalid");
    }
  };
  
  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    
    setDistributorForm(prev => ({
      ...prev,
      cnpj: rawValue
    }));
    
    if (cnpjStatus !== "idle") {
      setCnpjStatus("idle");
      setCnpjError("");
    }
  };

  const handleValidateCnpj = () => {
    const cnpj = unformatCnpj(distributorForm.cnpj);
    if (cnpj.length === 14) {
      fetchCnpjData(cnpj);
    } else {
      setCnpjError("CNPJ deve conter 14 dígitos");
      setCnpjStatus("invalid");
    }
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>, addressId: string, type: AddressType) => {
    const cep = e.target.value.replace(/\D/g, "");
    
    setDistributorForm(prev => {
      if (type === "billing") {
        return {
          ...prev,
          billingAddress: {
            ...prev.billingAddress,
            cep,
          }
        };
      } else {
        const updatedAddresses = prev.deliveryAddresses.map(addr => 
          addr.id === addressId ? { ...addr, cep } : addr
        );
        return {
          ...prev,
          deliveryAddresses: updatedAddresses
        };
      }
    });

    if (cep.length === 8) {
      fetchAddressByCep(cep, addressId, type);
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
    addressId: string,
    type: AddressType
  ) => {
    setDistributorForm(prev => {
      if (type === "billing") {
        return {
          ...prev,
          billingAddress: {
            ...prev.billingAddress,
            [field]: e.target.value,
          }
        };
      } else {
        const updatedAddresses = prev.deliveryAddresses.map(addr => 
          addr.id === addressId ? { ...addr, [field]: e.target.value } : addr
        );
        return {
          ...prev,
          deliveryAddresses: updatedAddresses
        };
      }
    });
  };

  const handleAddDeliveryAddress = () => {
    setDistributorForm(prev => ({
      ...prev,
      deliveryAddresses: [...prev.deliveryAddresses, emptyAddress()]
    }));
  };

  const handleRemoveDeliveryAddress = (addressId: string) => {
    setDistributorForm(prev => ({
      ...prev,
      deliveryAddresses: prev.deliveryAddresses.filter(addr => addr.id !== addressId)
    }));
  };

  const handleContactChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setDistributorForm(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: e.target.value,
      }
    }));
  };

  const handleSubmit = async () => {
    setFormStatus("submitting");

    try {
      // Simulated async submission
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Reset form after successful submission
      setDistributorForm({
        name: "",
        cnpj: "",
        billingAddress: emptyAddress(),
        deliveryAddresses: [emptyAddress()],
        contactInfo: emptyContactInfo(),
      });
      
      setDisplayCnpj("");
      setCnpjStatus("idle");
      setCnpjError("");

      setFormStatus("success");
      setActiveTab("cadastro"); // Reset to first tab after successful submission
    } catch (error) {
      setFormStatus("error");
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setFormStatus("idle");
    }, 3000);
  };

  const renderSubmitButton = () => {
    const buttonVariants = {
      idle: {
        backgroundColor: "hsl(var(--primary))",
        color: "hsl(var(--primary-foreground))",
      },
      submitting: {
        backgroundColor: "hsl(var(--muted))",
        color: "hsl(var(--muted-foreground))",
      },
      success: {
        backgroundColor: "hsl(var(--green-500))",
        color: "white",
      },
      error: {
        backgroundColor: "hsl(var(--destructive))",
        color: "hsl(var(--destructive-foreground))",
      },
    };

    const buttonContents = {
      idle: "Enviar Cadastro",
      submitting: "Enviando...",
      success: "Enviado com Sucesso",
      error: "Erro no Envio",
    };

    const renderIcon = () => {
      switch (formStatus) {
        case "submitting":
          return (
            <div className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin" />
          );
        case "success":
          return <Check className="w-5 h-5" />;
        case "error":
          return <AlertTriangle className="w-5 h-5" />;
        default:
          return null;
      }
    };

    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={buttonVariants[formStatus]}
        onClick={handleSubmit}
        className="w-full flex items-center justify-center space-x-2 p-2 rounded-md transition-all duration-300"
      >
        {renderIcon()}
        <span>{buttonContents[formStatus]}</span>
      </motion.button>
    );
  };

  const renderCnpjField = () => {
    const getCnpjStatusColor = () => {
      switch (cnpjStatus) {
        case "valid": return "text-green-500";
        case "invalid": return "text-red-500";
        default: return "text-gray-400";
      }
    };

    const getCnpjStatusIcon = () => {
      switch (cnpjStatus) {
        case "loading": 
          return <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"/>;
        case "valid": 
          return <Check className="w-4 h-4 text-green-500" />;
        case "invalid": 
          return <AlertTriangle className="w-4 h-4 text-red-500" />;
        default: 
          return null;
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        <Label
          htmlFor="distributor-cnpj"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          CNPJ
        </Label>
        <div className="relative flex items-center">
          <Input
            id="distributor-cnpj"
            type="text"
            placeholder="CNPJ do Distribuidor"
            value={displayCnpj}
            onChange={handleCnpjChange}
            className="w-full focus:ring-2 focus:ring-primary/50 transition-all duration-300 pr-20"
            maxLength={18}
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <span className={cn("mr-1", getCnpjStatusColor())}>
              {getCnpjStatusIcon()}
            </span>
            <Button 
              type="button" 
              size="sm" 
              variant="outline" 
              className="h-7 py-0 px-2 text-xs"
              onClick={handleValidateCnpj}
              disabled={cnpjStatus === "loading" || unformatCnpj(distributorForm.cnpj).length !== 14}
            >
              <Search className="w-3 h-3 mr-1" /> Verificar
            </Button>
          </div>
        </div>
        {cnpjError && (
          <p className="text-sm text-red-500 mt-1">{cnpjError}</p>
        )}
        {cnpjStatus === "valid" && (
          <p className="text-sm text-green-500 mt-1">CNPJ válido e ativo</p>
        )}
      </motion.div>
    );
  };

  const renderFormBySection = (section: string) => {
    const sectionFields = distributorFormFields.filter(
      (field) => field.section === section && field.name !== "cnpj" // Excluir o campo CNPJ padrão
    );

    return (
      <div className="grid md:grid-cols-2 gap-6">
        {sectionFields.map((field) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label
              htmlFor={`distributor-${field.name}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={`distributor-${field.name}`}
                type={field.type}
                placeholder={field.placeholder}
                value={
                  distributorForm[field.name as keyof typeof distributorForm] as string
                }
                onChange={(e) =>
                  setDistributorForm((prev) => ({
                    ...prev,
                    [field.name]: e.target.value,
                  }))
                }
                className="w-full focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </div>
          </motion.div>
        ))}
        
        {/* Renderizando campo CNPJ personalizado */}
        {renderCnpjField()}
      </div>
    );
  };

  const renderAddressFields = (address: Address, type: AddressType) => {
    return (
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {addressFields.map((field) => (
          <motion.div
            key={`${address.id}-${field.name}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label
              htmlFor={`${type}-${address.id}-${field.name}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={`${type}-${address.id}-${field.name}`}
                type={field.type}
                placeholder={field.placeholder}
                value={address[field.name as keyof Address] as string}
                onChange={
                  field.name === "cep"
                    ? (e) => handleCepChange(e, address.id, type)
                    : (e) => handleAddressChange(e, field.name, address.id, type)
                }
                className="w-full focus:ring-2 focus:ring-primary/50 transition-all duration-300"
                disabled={
                  isLoadingCep[address.id] &&
                  ["street", "neighborhood", "city", "state"].includes(field.name)
                }
              />
              {field.name === "cep" && isLoadingCep[address.id] && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {field.name === "cep" && cepErrors[address.id] && (
              <p className="text-sm text-red-500 mt-1">{cepErrors[address.id]}</p>
            )}
          </motion.div>
        ))}
      </div>
    );
  };

  const renderContactFields = () => {
    return (
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {contactFields.map((field) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-2"
          >
            <Label
              htmlFor={`contact-${field.name}`}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
            </Label>
            <div className="relative">
              <Input
                id={`contact-${field.name}`}
                type={field.type}
                placeholder={field.placeholder}
                value={distributorForm.contactInfo[field.name as keyof ContactInfo] as string}
                onChange={(e) => handleContactChange(e, field.name)}
                className="w-full focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCadastroTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <h1 className="font-medium text-lg flex items-center gap-2">
          <FileText className="w-5 h-5" /> Dados Cadastrais:
        </h1>
        {renderFormBySection("main")}
      </div>
    </motion.div>
  );

  const renderEnderecoTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <h1 className="font-medium text-lg flex items-center gap-2">
          <MapPin className="w-5 h-5" /> Endereços:
        </h1>
        
        <Accordion type="single" defaultValue="billing" collapsible className="w-full">
          <AccordionItem value="billing">
            <AccordionTrigger className="text-lg font-medium py-4">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Endereço de Faturamento</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              {renderAddressFields(distributorForm.billingAddress, "billing")}
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="delivery">
            <AccordionTrigger className="text-lg font-medium py-4">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Endereço de Entrega</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pt-4 pb-2">
              {distributorForm.deliveryAddresses.map((address, index) => (
                <div key={address.id} className="mb-8 last:mb-2">
                  {index > 0 && (
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Endereço de Entrega {index + 1}</h3>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRemoveDeliveryAddress(address.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remover
                      </Button>
                    </div>
                  )}
                  {renderAddressFields(address, "delivery")}
                  {index === distributorForm.deliveryAddresses.length - 1 && (
                    <div className="flex justify-center mt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddDeliveryAddress}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" /> Adicionar outro endereço de entrega
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </motion.div>
  );

  const renderContatoTab = () => (
    <motion.div
      initial={{ opacity: 0, x: 15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -15 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <h1 className="font-medium text-lg flex items-center gap-2">
          <Phone className="w-5 h-5" /> Informações de Contato:
        </h1>
        {renderContactFields()}
        
        {/* Botão de envio aparece apenas na última tab */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pt-4"
        >
          {renderSubmitButton()}
        </motion.div>
      </div>
    </motion.div>
  );

  // Feedback visual de progresso no formulário
  

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg relative"
    >
      {/* Header with Title on the left and Tabs on the right */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Informações do Distribuidor
        </h2>
        
        {/* Animated Compact Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: -15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex rounded-lg bg-gray-100 dark:bg-gray-800 p-1 shadow-md"
        >
          <CompactTabButton 
            active={activeTab === "cadastro"} 
            onClick={() => setActiveTab("cadastro")}
            icon={<UserRound className="w-4 h-4" />}
          >
            Cadastro
          </CompactTabButton>
          <CompactTabButton 
            active={activeTab === "endereco"} 
            onClick={() => setActiveTab("endereco")}
            icon={<MapPin className="w-4 h-4" />}
          >
            Endereço
          </CompactTabButton>
          <CompactTabButton 
            active={activeTab === "contato"} 
            onClick={() => setActiveTab("contato")}
            icon={<Phone className="w-4 h-4" />}
          >
            Contato
          </CompactTabButton>
        </motion.div>
      </div>

      {/* Indicador de progresso */}

      <div>
        <AnimatePresence mode="wait">
          {activeTab === "cadastro" && renderCadastroTab()}
          {activeTab === "endereco" && renderEnderecoTab()}
          {activeTab === "contato" && renderContatoTab()}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// Custom Tab Button Component
function TabButton({ 
  children, 
  active, 
  onClick,
  icon 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-all duration-300 relative",
        active 
          ? "text-primary bg-white dark:bg-gray-900 shadow" 
          : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      )}
    >
      {icon}
      {children}
      {active && (
        <motion.div 
          layoutId="active-tab-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </button>
  );
}

// Compact Tab Button Component
function CompactTabButton({ 
  children, 
  active, 
  onClick,
  icon 
}: { 
  children: React.ReactNode; 
  active: boolean; 
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(
        "py-1 px-3 text-xs font-medium flex items-center justify-center gap-1 rounded-md transition-all duration-200",
        active 
          ? "text-white bg-primary shadow-sm" 
          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
      )}
    >
      {icon}
      {children}
    </motion.button>
  );
}