"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const hospitalFormFields = [
  { 
    name: "name", 
    label: "Nome", 
    placeholder: "Nome do Hospital/Clínica",
    type: "text"
  },
  { 
    name: "cnpj", 
    label: "CNPJ", 
    placeholder: "CNPJ do Hospital/Clínica",
    type: "text"
  },
  { 
    name: "responsiblePerson", 
    label: "Pessoa Responsável", 
    placeholder: "Nome da Pessoa Responsável",
    type: "text"
  },
  { 
    name: "email", 
    label: "Email", 
    placeholder: "Email do Hospital/Clínica",
    type: "email"
  },
  { 
    name: "phone", 
    label: "Telefone", 
    placeholder: "Telefone do Hospital/Clínica",
    type: "tel"
  }
];

export default function HospitalForm() {
  const [hospitalForm, setHospitalForm] = useState({
    name: '',
    cnpj: '',
    responsiblePerson: '',
    email: '',
    phone: '',
  });

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const handleSubmit = async () => {
    // Update form status to submitting
    setFormStatus('submitting');
    
    try {
      // Simulated async submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form after successful submission
      setHospitalForm({
        name: '',
        cnpj: '',
        responsiblePerson: '',
        email: '',
        phone: '',
      });
      
      // Set status to success
      setFormStatus('success');
    } catch (error) {
      // Set status to error if submission fails
      setFormStatus('error');
    }

    // Reset status after 3 seconds
    setTimeout(() => {
      setFormStatus('idle');
    }, 3000);
  };

  const renderSubmitButton = () => {
    const buttonVariants = {
      idle: { 
        backgroundColor: 'hsl(var(--primary))', 
        color: 'hsl(var(--primary-foreground))' 
      },
      submitting: { 
        backgroundColor: 'hsl(var(--muted))', 
        color: 'hsl(var(--muted-foreground))' 
      },
      success: { 
        backgroundColor: 'hsl(var(--green-500))', 
        color: 'white' 
      },
      error: { 
        backgroundColor: 'hsl(var(--destructive))', 
        color: 'hsl(var(--destructive-foreground))' 
      }
    };

    const buttonContents = {
      idle: "Enviar Cadastro",
      submitting: "Enviando...",
      success: "Enviado com Sucesso",
      error: "Erro no Envio"
    };

    const renderIcon = () => {
      switch (formStatus) {
        case 'submitting':
          return (
            <div 
              className="w-5 h-5 border-2 border-t-transparent border-current rounded-full animate-spin"
            />
          );
        case 'success':
          return <Check className="w-5 h-5" />;
        case 'error':
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg"
    >
      <div className="grid md:grid-cols-2 gap-6">
        {hospitalFormFields.map((field) => (
          <motion.div 
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label 
              htmlFor={`hospital-${field.name}`} 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
            </Label>
            <Input
              id={`hospital-${field.name}`}
              type={field.type}
              placeholder={field.placeholder}
              value={hospitalForm[field.name as keyof typeof hospitalForm]}
              onChange={(e) => setHospitalForm((prev) => ({
                ...prev, 
                [field.name]: e.target.value
              }))}
              className="w-full focus:ring-2 focus:ring-primary/50 transition-all duration-300"
            />
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {renderSubmitButton()}
      </motion.div>
    </motion.div>
  );
}