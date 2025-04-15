import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTemplate } from "@/contexts/TemplateContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Info } from "lucide-react";

interface Variable {
  name: string;
  value: string;
  fallback?: string;
  maxLength?: number;
}

interface VariableEditorProps {
  onVariablesChange: (variables: Record<string, string>) => void;
}

const VariableEditor = ({ onVariablesChange }: VariableEditorProps) => {
  const { template } = useTemplate();
  const [variables, setVariables] = useState<Variable[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Extract variables from template sections
    const extractedVars = new Set<string>();
    
    template.sections.forEach(section => {
      if (section.text) {
        const matches = section.text.match(/\{\{([^}]+)\}\}/g) || [];
        matches.forEach(match => {
          const varName = match.replace(/\{\{|\}\}/g, '');
          extractedVars.add(varName);
        });
      }
    });

    // Initialize variables with default values
    const newVariables = Array.from(extractedVars).map(name => ({
      name,
      value: '',
      fallback: '',
      maxLength: name.includes('name') ? 25 : 100, // Example: names have shorter max length
    }));

    setVariables(newVariables);
  }, [template]);

  const handleVariableChange = (name: string, field: 'value' | 'fallback', newValue: string) => {
    setVariables(prev => {
      const updated = prev.map(v => 
        v.name === name ? { ...v, [field]: newValue } : v
      );
      
      // Validate variables
      const newErrors: Record<string, string> = {};
      updated.forEach(v => {
        if (v.maxLength && v.value.length > v.maxLength) {
          newErrors[v.name] = `Value exceeds maximum length of ${v.maxLength} characters`;
        }
      });
      setErrors(newErrors);
      
      // Update parent component with valid variables
      const validVariables = updated.reduce((acc, v) => {
        if (!newErrors[v.name]) {
          acc[v.name] = v.value || v.fallback || '';
        }
        return acc;
      }, {} as Record<string, string>);
      
      onVariablesChange(validVariables);
      
      return updated;
    });
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          <p className="text-sm text-gray-600">
            Use variables to personalize your template. Add fallback values for when variables are empty.
          </p>
        </div>

        {variables.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No variables found in template. Use {{variable_name}} in your text to add variables.
          </p>
        ) : (
          <div className="space-y-4">
            {variables.map(variable => (
              <div key={variable.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">
                    {`{{${variable.name}}}`}
                  </Label>
                  {variable.maxLength && (
                    <span className="text-xs text-gray-500">
                      {variable.value.length}/{variable.maxLength}
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Input
                      value={variable.value}
                      onChange={(e) => handleVariableChange(variable.name, 'value', e.target.value)}
                      placeholder="Variable value"
                      className={errors[variable.name] ? 'border-red-500' : ''}
                    />
                    {errors[variable.name] && (
                      <p className="text-xs text-red-500 mt-1">{errors[variable.name]}</p>
                    )}
                  </div>
                  
                  <div>
                    <Input
                      value={variable.fallback || ''}
                      onChange={(e) => handleVariableChange(variable.name, 'fallback', e.target.value)}
                      placeholder="Fallback value"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Used when variable is empty
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {Object.keys(errors).length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some variables have validation errors. Please fix them before saving.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
};

export default VariableEditor; 