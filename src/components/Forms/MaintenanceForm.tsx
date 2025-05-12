"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wrench, Check, AlertTriangle } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type FormStatus = 'idle' | 'submitting' | 'success' | 'error';

const maintenanceFormFields = [
  { 
    name: "equipmentModel", 
    label: "Modelo do Equipamento", 
    placeholder: "Modelo do Equipamento",
    type: "text"
  },
  { 
    name: "serialNumber", 
    label: "Número de Série", 
    placeholder: "Número de Série do Equipamento",
    type: "text"
  },
  { 
    name: "problemDescription", 
    label: "Descrição do Problema", 
    placeholder: "Descreva o problema do equipamento",
    type: "text"
  },
  { 
    name: "contactName", 
    label: "Nome do Contato", 
    placeholder: "Nome da Pessoa de Contato",
    type: "text"
  },
  { 
    name: "contactPhone", 
    label: "Telefone de Contato", 
    placeholder: "Telefone para Contato",
    type: "tel"
  }
];

export default function MaintenanceForm() {
  const [maintenanceForm, setMaintenanceForm] = useState({
    equipmentModel: '',
    serialNumber: '',
    problemDescription: '',
    contactName: '',
    contactPhone: '',
  });

  const [formStatus, setFormStatus] = useState<FormStatus>('idle');

  const handleSubmit = async () => {
    // Update form status to submitting
    setFormStatus('submitting');
    
    try {
      // Simulated async submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Reset form after successful submission
      setMaintenanceForm({
        equipmentModel: '',
        serialNumber: '',
        problemDescription: '',
        contactName: '',
        contactPhone: '',
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
        {maintenanceFormFields.map((field) => (
          <motion.div 
            key={field.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Label 
              htmlFor={`maintenance-${field.name}`} 
              className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {field.label}
            </Label>
            <Input
              id={`maintenance-${field.name}`}
              type={field.type}
              placeholder={field.placeholder}
              value={maintenanceForm[field.name as keyof typeof maintenanceForm]}
              onChange={(e) => setMaintenanceForm((prev) => ({
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