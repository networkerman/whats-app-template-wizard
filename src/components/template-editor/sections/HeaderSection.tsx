
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
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/contexts/TemplateContext";
import DeleteButton from "../DeleteButton";
import { Camera, FileVideo, TextIcon } from "lucide-react";

interface HeaderSectionProps {
  section: any;
  index: number;
  onDelete: () => void;
}

const HeaderSection = ({ section, index, onDelete }: HeaderSectionProps) => {
  const { updateSection } = useTemplate();
  
  const handleFormatChange = (format: string) => {
    updateSection(index, { ...section, format });
  };
  
  const handleTextChange = (text: string) => {
    updateSection(index, { ...section, text });
  };
  
  const handleUrlChange = (url: string) => {
    updateSection(index, { ...section, url });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <span>Header</span>
          </div>
          <DeleteButton onDelete={onDelete} />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Format</label>
            <Select value={section.format} onValueChange={handleFormatChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text" className="flex items-center">
                  <div className="flex items-center">
                    <TextIcon className="w-4 h-4 mr-2" />
                    <span>Text</span>
                  </div>
                </SelectItem>
                <SelectItem value="image">
                  <div className="flex items-center">
                    <Camera className="w-4 h-4 mr-2" />
                    <span>Image</span>
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center">
                    <FileVideo className="w-4 h-4 mr-2" />
                    <span>Video</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {section.format === 'text' && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">Text</label>
              <Textarea 
                value={section.text || ''} 
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter header text. Use {{variable_name}} for dynamic content."
                className="resize-none"
                rows={2}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supports variables like {{first_name}} or {{order_number}}
              </p>
            </div>
          )}
          
          {(section.format === 'image' || section.format === 'video') && (
            <div>
              <label className="text-sm font-medium mb-1.5 block">URL</label>
              <Input 
                value={section.url || ''} 
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={`Enter ${section.format} URL`}
              />
              <p className="text-xs text-gray-500 mt-1">
                {section.format === 'image' 
                  ? 'Image should be JPEG or PNG, max 5MB' 
                  : 'Video should be MP4, max 16MB'}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderSection;
