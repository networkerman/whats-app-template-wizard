
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTemplate } from "@/contexts/TemplateContext";
import HeaderSection from "./sections/HeaderSection";
import BodySection from "./sections/BodySection";
import FooterSection from "./sections/FooterSection";
import ButtonsSection from "./sections/ButtonsSection";
import ProductSection from "./sections/ProductSection";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditorContent = () => {
  const { template, removeSection } = useTemplate();
  const { sections } = template;

  const renderSection = (section: any, index: number) => {
    const sectionProps = {
      section,
      index,
      onDelete: () => removeSection(index),
    };

    switch (section.type) {
      case "header":
        return <HeaderSection key={index} {...sectionProps} />;
      case "body":
        return <BodySection key={index} {...sectionProps} />;
      case "footer":
        return <FooterSection key={index} {...sectionProps} />;
      case "buttons":
        return <ButtonsSection key={index} {...sectionProps} />;
      case "product":
        return <ProductSection key={index} {...sectionProps} />;
      default:
        return <div key={index}>Unknown section type</div>;
    }
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {sections.length === 0 && (
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-md">
            <p className="text-gray-500 mb-4">Your template is empty</p>
            <p className="text-sm text-gray-400 text-center">
              Add components from the sidebar to create your template
            </p>
          </div>
        )}

        {sections.map((section, index) => (
          <div key={index} className="relative">
            {renderSection(section, index)}
          </div>
        ))}

        {template.errors.length > 0 && (
          <Alert variant="destructive" className="mt-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc pl-5 text-sm">
                {template.errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </div>
    </ScrollArea>
  );
};

export default EditorContent;
