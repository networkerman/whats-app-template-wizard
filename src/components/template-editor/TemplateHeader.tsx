
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTemplate } from "@/contexts/TemplateContext";

const TemplateHeader = () => {
  const { template, updateTemplateMeta } = useTemplate();
  
  return (
    <div className="p-6 border-b">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-5">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Template Name</label>
          <Input 
            placeholder="Enter template name" 
            value={template.name}
            onChange={(e) => updateTemplateMeta("name", e.target.value)}
          />
        </div>
        <div className="md:col-span-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
          <Select 
            value={template.category}
            onValueChange={(value) => updateTemplateMeta("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="marketing">Marketing</SelectItem>
              <SelectItem value="utility">Utility</SelectItem>
              <SelectItem value="authentication">Authentication</SelectItem>
              <SelectItem value="customer_support">Customer Support</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-3">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Language</label>
          <Select 
            value={template.language}
            onValueChange={(value) => updateTemplateMeta("language", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en_US">English (US)</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="pt_BR">Portuguese (Brazil)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TemplateHeader;
