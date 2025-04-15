
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useTemplate } from "@/contexts/TemplateContext";
import DeleteButton from "../DeleteButton";
import { Button } from "@/components/ui/button";
import { Link, Phone, Plus, Reply, Trash2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ButtonsSectionProps {
  section: any;
  index: number;
  onDelete: () => void;
}

const ButtonsSection = ({ section, index, onDelete }: ButtonsSectionProps) => {
  const { updateSection } = useTemplate();
  
  const initButtons = () => {
    if (!section.buttons || !Array.isArray(section.buttons)) {
      return updateSection(index, { ...section, buttons: [] });
    }
  };

  // Ensure buttons array is initialized
  if (!section.buttons) {
    initButtons();
  }
  
  const addButton = (type: string) => {
    const newButton = { type, text: "" };
    if (type === "url") {
      Object.assign(newButton, { url: "" });
    } else if (type === "phone") {
      Object.assign(newButton, { phoneNumber: "" });
    }
    
    const updatedButtons = [...(section.buttons || []), newButton];
    updateSection(index, { ...section, buttons: updatedButtons });
  };
  
  const removeButton = (buttonIndex: number) => {
    const updatedButtons = [...(section.buttons || [])];
    updatedButtons.splice(buttonIndex, 1);
    updateSection(index, { ...section, buttons: updatedButtons });
  };
  
  const updateButton = (buttonIndex: number, buttonData: any) => {
    const updatedButtons = [...(section.buttons || [])];
    updatedButtons[buttonIndex] = { ...updatedButtons[buttonIndex], ...buttonData };
    updateSection(index, { ...section, buttons: updatedButtons });
  };
  
  const buttonTypes = [
    { value: "url", label: "URL Button", icon: <Link className="w-4 h-4 mr-2" /> },
    { value: "phone", label: "Phone Button", icon: <Phone className="w-4 h-4 mr-2" /> },
    { value: "quick_reply", label: "Quick Reply", icon: <Reply className="w-4 h-4 mr-2" /> },
  ];
  
  const canAddMoreButtons = !section.buttons || section.buttons.length < 3;
  
  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <span>Buttons</span>
          </div>
          <DeleteButton onDelete={onDelete} />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          {section.buttons && section.buttons.map((button: any, buttonIndex: number) => (
            <div key={buttonIndex} className="border rounded-md p-3">
              <div className="flex justify-between items-center mb-3">
                <h4 className="text-sm font-medium">{buttonTypes.find(t => t.value === button.type)?.label || "Button"}</h4>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={() => removeButton(buttonIndex)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium mb-1 block">Button Text</label>
                  <Input 
                    value={button.text || ''} 
                    onChange={(e) => updateButton(buttonIndex, { text: e.target.value })}
                    placeholder="Enter button text"
                    className="h-8 text-sm"
                  />
                </div>
                
                {button.type === 'url' && (
                  <div>
                    <label className="text-xs font-medium mb-1 block">URL</label>
                    <Input 
                      value={button.url || ''} 
                      onChange={(e) => updateButton(buttonIndex, { url: e.target.value })}
                      placeholder="https://"
                      className="h-8 text-sm"
                    />
                  </div>
                )}
                
                {button.type === 'phone' && (
                  <div>
                    <label className="text-xs font-medium mb-1 block">Phone Number</label>
                    <Input 
                      value={button.phoneNumber || ''} 
                      onChange={(e) => updateButton(buttonIndex, { phoneNumber: e.target.value })}
                      placeholder="+1234567890"
                      className="h-8 text-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {canAddMoreButtons && (
            <div className="flex flex-wrap gap-2">
              {buttonTypes.map((type) => (
                <Tooltip key={type.value}>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => addButton(type.value)}
                      className="flex-1"
                    >
                      <Plus className="w-3 h-3 mr-1" />
                      {type.label}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{`Add ${type.label}`}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          )}
          
          {!canAddMoreButtons && (
            <p className="text-xs text-amber-600">
              Maximum 3 buttons allowed per template
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ButtonsSection;
