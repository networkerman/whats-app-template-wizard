
import { useTemplate } from "@/contexts/TemplateContext";
import { formatVariables } from "@/utils/templateUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";

const Preview = () => {
  const { template } = useTemplate();
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});
  const [showVariableEditor, setShowVariableEditor] = useState(false);
  
  const handleVariableChange = (key: string, value: string) => {
    setPreviewVariables((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const renderHeader = () => {
    const headerSection = template.sections.find(section => section.type === "header");
    if (!headerSection) return null;
    
    if (headerSection.format === "text") {
      return (
        <div className="text-sm font-medium mb-2">
          {formatVariables(headerSection.text || "", previewVariables)}
        </div>
      );
    }
    
    if (headerSection.format === "image") {
      return (
        <div className="mb-3">
          <img 
            src={headerSection.url || "https://placehold.co/600x400?text=Header+Image"} 
            alt="Header" 
            className="w-full rounded-t-lg h-48 object-cover"
          />
        </div>
      );
    }

    return null;
  };
  
  const renderBody = () => {
    const bodySection = template.sections.find(section => section.type === "body");
    if (!bodySection) return null;
    
    return (
      <div className="text-sm mb-3 whitespace-pre-line">
        {formatVariables(bodySection.text || "", previewVariables)}
      </div>
    );
  };
  
  const renderFooter = () => {
    const footerSection = template.sections.find(section => section.type === "footer");
    if (!footerSection) return null;
    
    return (
      <div className="text-xs text-gray-500 mt-2">
        {formatVariables(footerSection.text || "", previewVariables)}
      </div>
    );
  };
  
  const renderButtons = () => {
    const buttonsSection = template.sections.find(section => section.type === "buttons");
    if (!buttonsSection || !buttonsSection.buttons?.length) return null;
    
    return (
      <div className="mt-3 space-y-2">
        {buttonsSection.buttons.map((button: any, index: number) => (
          <button 
            key={index}
            className="w-full py-2 px-3 bg-white border border-gray-300 text-sm rounded-md text-center hover:bg-gray-50"
          >
            {button.text}
          </button>
        ))}
      </div>
    );
  };

  const extractVariables = () => {
    const variables: string[] = [];
    
    template.sections.forEach(section => {
      if (section.text) {
        const matches = section.text.match(/\{\{([^}]+)\}\}/g) || [];
        matches.forEach(match => {
          const varName = match.replace(/\{\{|\}\}/g, '');
          if (!variables.includes(varName)) {
            variables.push(varName);
          }
        });
      }
    });
    
    return variables;
  };
  
  const variables = extractVariables();

  return (
    <div className="flex flex-col items-center">
      <div className="w-72 max-w-full border rounded-xl overflow-hidden bg-white shadow-sm mb-4">
        <div className="bg-green-500 text-white p-2 flex items-center">
          <Smartphone className="h-4 w-4 mr-2" />
          <span className="text-xs font-medium">WhatsApp Preview</span>
        </div>
        <div className="p-3">
          <ScrollArea className="h-[420px]">
            <div className="space-y-2">
              {renderHeader()}
              {renderBody()}
              {renderFooter()}
              {renderButtons()}
              
              {template.sections.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <p>Add components to see the preview</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
      
      {variables.length > 0 && (
        <>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowVariableEditor(!showVariableEditor)}
            className="mb-4"
          >
            {showVariableEditor ? "Hide" : "Edit"} Variables
          </Button>
          
          {showVariableEditor && (
            <div className="w-full border rounded-md p-4 bg-white">
              <h4 className="text-sm font-medium mb-3">Template Variables</h4>
              <div className="space-y-2">
                {variables.map((variable) => (
                  <div key={variable} className="grid grid-cols-12 gap-2 items-center">
                    <Label className="col-span-5 text-xs">{`{{${variable}}}`}</Label>
                    <Input 
                      className="col-span-7 h-8 text-xs"
                      placeholder="Variable value"
                      value={previewVariables[variable] || ""}
                      onChange={(e) => handleVariableChange(variable, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Preview;
