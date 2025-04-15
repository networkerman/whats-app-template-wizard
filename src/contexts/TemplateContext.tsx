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
  variables?: string[];
}

interface Template {
  id?: string;
  name: string;
  language: string;
  category: string;
  sections: TemplateSection[];
  errors: string[];
  status: 'draft' | 'approved' | 'live';
  version: number;
  lastEdited: Date;
  activeCampaigns: string[];
  variables: Record<string, string>;
}

interface TemplateContextType {
  template: Template;
  updateTemplateMeta: (field: string, value: string) => void;
  addSection: (type: string, format?: string) => void;
  updateSection: (index: number, section: TemplateSection) => void;
  removeSection: (index: number) => void;
  reorderSections: (fromIndex: number, toIndex: number) => void;
  validateTemplate: () => { valid: boolean; message?: string };
  saveTemplate: () => Promise<void>;
  approveTemplate: () => Promise<void>;
  getTemplateHistory: () => Template[];
  getActiveCampaigns: () => string[];
  updateVariables: (variables: Record<string, string>) => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export const TemplateProvider = ({ children }: { children: ReactNode }) => {
  const [template, setTemplate] = useState<Template>({
    name: "New Template",
    language: "en_US",
    category: "marketing",
    sections: [],
    errors: [],
    status: "draft",
    version: 1,
    lastEdited: new Date(),
    activeCampaigns: [],
    variables: {},
  });

  const [templateHistory, setTemplateHistory] = useState<Template[]>([]);

  const updateTemplateMeta = (field: string, value: string) => {
    setTemplate((prev) => ({ 
      ...prev, 
      [field]: value,
      lastEdited: new Date(),
    }));
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
    
    // Check if the section type already exists
    const existingIndex = template.sections.findIndex(section => section.type === type);
    
    if (existingIndex !== -1) {
      // Replace the existing section
      const updatedSections = [...template.sections];
      updatedSections[existingIndex] = newSection;
      setTemplate((prev) => ({ 
        ...prev, 
        sections: updatedSections,
        lastEdited: new Date(),
      }));
    } else {
      // Add new section
      setTemplate((prev) => ({ 
        ...prev, 
        sections: [...prev.sections, newSection],
        lastEdited: new Date(),
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
      lastEdited: new Date(),
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
      lastEdited: new Date(),
    }));
    
    // Validate the template after removing a section
    validateTemplate();
  };

  const reorderSections = (fromIndex: number, toIndex: number) => {
    const updatedSections = [...template.sections];
    const [movedSection] = updatedSections.splice(fromIndex, 1);
    updatedSections.splice(toIndex, 0, movedSection);
    
    setTemplate((prev) => ({ 
      ...prev, 
      sections: updatedSections,
      lastEdited: new Date(),
    }));
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

  const saveTemplate = async () => {
    // Save current version to history
    setTemplateHistory(prev => [...prev, template]);
    
    // Increment version and update status
    setTemplate(prev => ({
      ...prev,
      version: prev.version + 1,
      status: "draft",
      lastEdited: new Date(),
    }));
  };

  const approveTemplate = async () => {
    if (template.status === "live") {
      // Check if template was edited in the last 24 hours
      const lastEditTime = new Date(template.lastEdited).getTime();
      const now = new Date().getTime();
      const hoursSinceLastEdit = (now - lastEditTime) / (1000 * 60 * 60);
      
      if (hoursSinceLastEdit < 24) {
        throw new Error("Template can only be edited once every 24 hours when live");
      }
    }
    
    // Save current version to history
    setTemplateHistory(prev => [...prev, template]);
    
    // Update status to approved
    setTemplate(prev => ({
      ...prev,
      status: "approved",
      lastEdited: new Date(),
    }));
  };

  const getTemplateHistory = () => {
    return templateHistory;
  };

  const getActiveCampaigns = () => {
    return template.activeCampaigns;
  };

  const updateVariables = (variables: Record<string, string>) => {
    setTemplate(prev => ({
      ...prev,
      variables,
      lastEdited: new Date(),
    }));
  };

  return (
    <TemplateContext.Provider
      value={{
        template,
        updateTemplateMeta,
        addSection,
        updateSection,
        removeSection,
        reorderSections,
        validateTemplate,
        saveTemplate,
        approveTemplate,
        getTemplateHistory,
        getActiveCampaigns,
        updateVariables,
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
