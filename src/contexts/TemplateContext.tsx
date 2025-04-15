
import { createContext, useContext, ReactNode, useState } from "react";
import { validateTemplateRules } from "@/utils/templateUtils";

interface TemplateSection {
  type: string;
  format?: string;
  text?: string;
  url?: string;
  buttons?: any[];
  product?: any;
  recommendationType?: string;
}

interface Template {
  name: string;
  language: string;
  category: string;
  sections: TemplateSection[];
  errors: string[];
}

interface TemplateContextType {
  template: Template;
  updateTemplateMeta: (field: string, value: string) => void;
  addSection: (type: string, format?: string) => void;
  updateSection: (index: number, section: TemplateSection) => void;
  removeSection: (index: number) => void;
  validateTemplate: () => { valid: boolean; message?: string };
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplate] = useState<Template>({
    name: "New Template",
    language: "en_US",
    category: "marketing",
    sections: [],
    errors: [],
  });

  const updateTemplateMeta = (field: string, value: string) => {
    setTemplate((prev) => ({ ...prev, [field]: value }));
  };

  const addSection = (type: string, format?: string) => {
    const newSection: TemplateSection = { type };
    
    // Set default values based on section type
    if (type === "header" && format) {
      newSection.format = format;
      if (format === "text") {
        newSection.text = "";
      } else if (format === "image" || format === "video") {
        newSection.url = "";
      }
    } else if (type === "body") {
      newSection.text = "";
    } else if (type === "footer") {
      newSection.text = "";
    } else if (type === "buttons") {
      newSection.buttons = [];
    } else if (type === "product") {
      newSection.product = {};
    }
    
    // Check if the section type already exists (for unique sections)
    const existingIndex = template.sections.findIndex(section => section.type === type);
    
    // If body exists (required) or only one of each type is allowed
    if ((type === "header" || type === "body" || type === "footer") && existingIndex !== -1) {
      // Replace the existing section
      const updatedSections = [...template.sections];
      updatedSections[existingIndex] = newSection;
      setTemplate((prev) => ({ ...prev, sections: updatedSections }));
    } else {
      // Add new section
      setTemplate((prev) => ({ 
        ...prev, 
        sections: [...prev.sections, newSection],
      }));
    }
    
    // Validate the template after adding a section
    validateTemplate();
  };

  const updateSection = (index: number, section: TemplateSection) => {
    const updatedSections = [...template.sections];
    updatedSections[index] = section;
    
    setTemplate((prev) => ({ 
      ...prev, 
      sections: updatedSections,
    }));
    
    // Validate the template after updating a section
    validateTemplate();
  };

  const removeSection = (index: number) => {
    // Don't allow removing the body section if it's the body
    if (template.sections[index].type === "body") {
      return;
    }
    
    const updatedSections = [...template.sections];
    updatedSections.splice(index, 1);
    
    setTemplate((prev) => ({ 
      ...prev, 
      sections: updatedSections,
    }));
    
    // Validate the template after removing a section
    validateTemplate();
  };

  const validateTemplate = () => {
    const validationResult = validateTemplateRules(template);
    
    setTemplate((prev) => ({ 
      ...prev, 
      errors: validationResult.errors,
    }));
    
    return {
      valid: validationResult.errors.length === 0,
      message: validationResult.errors.join(", "),
    };
  };

  return (
    <TemplateContext.Provider
      value={{
        template,
        updateTemplateMeta,
        addSection,
        updateSection,
        removeSection,
        validateTemplate,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export const useTemplate = (): TemplateContextType => {
  const context = useContext(TemplateContext);
  if (context === undefined) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }
  return context;
};
