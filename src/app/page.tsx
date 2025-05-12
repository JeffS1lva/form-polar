"use client"

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  Hospital, 
  Wrench 
} from 'lucide-react';

import DistributorForm from '@/components/Forms/Distribuitor';
import HospitalForm from '@/components/Forms/HospitalForm';
import MaintenanceForm from '@/components/Forms/MaintenanceForm';

export default function Page() {
  const [activeTab, setActiveTab] = useState("distribuidor");

  const formSections = [
    {
      value: "distribuidor",
      icon: <Building2 className="w-5 h-5" />,
      label: "Distribuidor",
      component: DistributorForm
    },
    {
      value: "hospitais",
      icon: <Hospital className="w-5 h-5" />,
      label: "Hospitais e Clinicas",
      component: HospitalForm
    },
    {
      value: "manutencao",
      icon: <Wrench className="w-5 h-5" />,
      label: "Manutenção",
      component: MaintenanceForm
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-4xl p-6"
    >
      <motion.h1 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl mb-8 text-center text-gray-300 dark:text-white"
      >
        Cadastro de Clientes
      </motion.h1>
      
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-6 bg-zinc-100 dark:bg-gray-800">
          {formSections.map((section) => (
            <TabsTrigger 
              key={section.value}
              value={section.value}
              className="flex items-center space-x-2 data-[state=active]:bg-blue-900 data-[state=active]:text-primary-foreground"
            >
              {section.icon}
              <span>{section.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {formSections.map((section) => {
          const FormComponent = section.component;
          return (
            <TabsContent 
              key={section.value} 
              value={section.value}
            >
              <FormComponent />
            </TabsContent>
          );
        })}
      </Tabs>
    </motion.div>
  );
}