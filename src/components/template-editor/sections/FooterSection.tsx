
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTemplate } from "@/contexts/TemplateContext";
import DeleteButton from "../DeleteButton";
import { LayoutList } from "lucide-react";

interface FooterSectionProps {
  section: any;
  index: number;
  onDelete: () => void;
}

const FooterSection = ({ section, index, onDelete }: FooterSectionProps) => {
  const { updateSection } = useTemplate();
  
  const handleTextChange = (text: string) => {
    updateSection(index, { ...section, text });
  };
  
  // Count characters in footer text
  const charCount = section.text?.length || 0;
  const maxChars = 60;
  const isOverLimit = charCount > maxChars;
  
  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <LayoutList className="w-4 h-4 mr-2" />
            <span>Footer</span>
          </div>
          <DeleteButton onDelete={onDelete} />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div>
          <Input 
            value={section.text || ''} 
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="Enter footer text"
          />
          <div className="flex justify-between mt-2">
            <p className="text-xs text-gray-500">
              Short text that appears at the bottom of the message
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

export default FooterSection;
