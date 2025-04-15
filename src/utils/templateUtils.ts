
export const formatVariables = (text: string, variables: Record<string, string>) => {
  if (!text) return "";
  
  return text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
    return variables[varName] || match;
  });
};

export const validateTemplateRules = (template: any) => {
  const errors: string[] = [];
  
  // Check if body section exists (required)
  const hasBody = template.sections.some((section: any) => section.type === "body");
  if (!hasBody) {
    errors.push("Template must include a body section");
  }
  
  // Check if body text is provided
  const bodySection = template.sections.find((section: any) => section.type === "body");
  if (bodySection && (!bodySection.text || bodySection.text.trim() === "")) {
    errors.push("Body text cannot be empty");
  }
  
  // Check character limits
  template.sections.forEach((section: any) => {
    if (section.type === "body" && section.text && section.text.length > 1024) {
      errors.push("Body text exceeds 1024 character limit");
    }
    
    if (section.type === "footer" && section.text && section.text.length > 60) {
      errors.push("Footer text exceeds 60 character limit");
    }
    
    if (section.type === "header" && section.format === "text" && section.text && section.text.length > 60) {
      errors.push("Header text exceeds 60 character limit");
    }
  });
  
  // Check button constraints
  const buttonsSection = template.sections.find((section: any) => section.type === "buttons");
  if (buttonsSection && buttonsSection.buttons) {
    if (buttonsSection.buttons.length > 3) {
      errors.push("Maximum 3 buttons allowed");
    }
    
    buttonsSection.buttons.forEach((button: any, index: number) => {
      if (!button.text || button.text.trim() === "") {
        errors.push(`Button ${index + 1} text cannot be empty`);
      }
      
      if (button.type === "url" && (!button.url || button.url.trim() === "")) {
        errors.push(`Button ${index + 1} URL cannot be empty`);
      }
      
      if (button.type === "phone" && (!button.phoneNumber || button.phoneNumber.trim() === "")) {
        errors.push(`Button ${index + 1} phone number cannot be empty`);
      }
    });
  }
  
  return { errors };
};
