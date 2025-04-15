import { format } from "date-fns";

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

  // Check media constraints
  template.sections.forEach((section: any) => {
    if (section.type === "header" && (section.format === "image" || section.format === "video")) {
      if (!section.url) {
        errors.push("Media URL is required for header");
      } else {
        // Check file size (simplified check - in production, this would need actual file size validation)
        if (section.format === "image" && section.url.length > 1000) {
          errors.push("Image size should be less than 2MB");
        }
        if (section.format === "video" && section.url.length > 1000) {
          errors.push("Video size should be less than 16MB");
        }
      }
    }
  });

  // Check variable constraints
  const variables = new Set<string>();
  template.sections.forEach((section: any) => {
    if (section.text) {
      const matches = section.text.match(/\{\{([^}]+)\}\}/g) || [];
      matches.forEach((match: string) => {
        const varName = match.replace(/\{\{|\}\}/g, '');
        variables.add(varName);
      });
    }
  });

  // Check header variable limit
  const headerSection = template.sections.find((section: any) => section.type === "header");
  if (headerSection && headerSection.text) {
    const headerVars = (headerSection.text.match(/\{\{([^}]+)\}\}/g) || []).length;
    if (headerVars > 1) {
      errors.push("Header can only contain 1 variable");
    }
  }

  // Check body/footer/CTA variable limit
  const bodyFooterVars = Array.from(variables).filter(varName => {
    const inBody = bodySection?.text?.includes(`{{${varName}}}`);
    const inFooter = template.sections.some((s: any) => 
      s.type === "footer" && s.text?.includes(`{{${varName}}}`)
    );
    const inButtons = template.sections.some((s: any) => 
      s.type === "buttons" && s.buttons?.some((b: any) => 
        b.text?.includes(`{{${varName}}}`) || b.url?.includes(`{{${varName}}}`)
      )
    );
    return inBody || inFooter || inButtons;
  }).length;

  if (bodyFooterVars > 10) {
    errors.push("Body, footer, and buttons combined can only contain 10 named variables");
  }

  // Check variable naming conventions
  Array.from(variables).forEach(varName => {
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(varName)) {
      errors.push(`Variable name '${varName}' must start with a letter and contain only letters, numbers, and underscores`);
    }
  });

  // Check template status constraints
  if (template.status === "live") {
    const lastEditTime = new Date(template.lastEdited).getTime();
    const now = new Date().getTime();
    const hoursSinceLastEdit = (now - lastEditTime) / (1000 * 60 * 60);
    
    if (hoursSinceLastEdit < 24) {
      errors.push("Live templates can only be edited once every 24 hours");
    }
  }

  return { errors };
};

export const convertToNumberedVariables = (text: string, variables: Record<string, string>) => {
  const varMap = new Map<string, number>();
  let counter = 1;
  
  // First pass: create mapping of named variables to numbers
  text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
    if (!varMap.has(varName)) {
      varMap.set(varName, counter++);
    }
    return match;
  });
  
  // Second pass: replace named variables with numbered ones
  const convertedText = text.replace(/\{\{([^}]+)\}\}/g, (match, varName) => {
    const number = varMap.get(varName);
    return number ? `{{${number}}}` : match;
  });
  
  // Convert variables object to numbered format
  const numberedVariables: Record<string, string> = {};
  varMap.forEach((number, varName) => {
    numberedVariables[number.toString()] = variables[varName];
  });
  
  return {
    text: convertedText,
    variables: numberedVariables,
  };
};

export const formatDate = (date: Date) => {
  return format(date, "MMM d, yyyy h:mm a");
};
