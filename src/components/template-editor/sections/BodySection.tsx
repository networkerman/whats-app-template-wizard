
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/contexts/TemplateContext";
import DeleteButton from "../DeleteButton";
import { TextIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface BodySectionProps {
  section: any;
  index: number;
  onDelete: () => void;
}

const BodySection = ({ section, index, onDelete }: BodySectionProps) => {
  const { updateSection } = useTemplate();
  
  const handleTextChange = (text: string) => {
    updateSection(index, { ...section, text });
  };
  
  // Count characters in body text
  const charCount = section.text?.length || 0;
  const maxChars = 1024;
  const isOverLimit = charCount > maxChars;
  
  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <TextIcon className="w-4 h-4 mr-2" />
            <span>Body</span>
            <Badge variant="outline" className="ml-3 font-normal">Required</Badge>
          </div>
          {/* Body section is required so we don't allow delete */}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div>
          <Textarea 
            value={section.text || ''} 
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter your message text. Use {{variable_name}} for dynamic content."
            className="resize-none min-h-[120px]"
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500">
              Supports variables like {{first_name}} or {{order_number}}
            </p>
            <p className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-500'}`}>
              {charCount}/{maxChars}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BodySection;
