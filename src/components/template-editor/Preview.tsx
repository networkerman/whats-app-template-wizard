import { useTemplate } from "@/contexts/TemplateContext";
import { formatVariables } from "@/utils/templateUtils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Smartphone } from "lucide-react";

interface PreviewProps {
  variables: Record<string, string>;
}

const Preview = ({ variables }: PreviewProps) => {
  const { template } = useTemplate();
  
  const renderHeader = () => {
    const headerSection = template.sections.find(section => section.type === "header");
    if (!headerSection) return null;
    
    if (headerSection.format === "text") {
      return (
        <div className="text-sm font-medium mb-2">
          {formatVariables(headerSection.text || "", variables)}
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

    if (headerSection.format === "video") {
      return (
        <div className="mb-3">
          <video 
            src={headerSection.url || "https://example.com/video.mp4"} 
            className="w-full rounded-t-lg h-48 object-cover"
            controls
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
        {formatVariables(bodySection.text || "", variables)}
      </div>
    );
  };
  
  const renderFooter = () => {
    const footerSection = template.sections.find(section => section.type === "footer");
    if (!footerSection) return null;
    
    return (
      <div className="text-xs text-gray-500 mt-2">
        {formatVariables(footerSection.text || "", variables)}
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
            {formatVariables(button.text || "", variables)}
          </button>
        ))}
      </div>
    );
  };

  const renderProduct = () => {
    const productSection = template.sections.find(section => section.type === "product");
    if (!productSection || !productSection.product) return null;
    
    const product = productSection.product;
    
    return (
      <div className="mt-3 border rounded-lg overflow-hidden">
        <img 
          src={product.imageUrl || "https://placehold.co/300x300?text=Product"} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <div className="p-3">
          <h4 className="font-medium">{formatVariables(product.name || "", variables)}</h4>
          <p className="text-sm text-gray-600 mt-1">
            {formatVariables(product.description || "", variables)}
          </p>
          <div className="flex justify-between items-center mt-2">
            <span className="font-medium">{formatVariables(product.price || "", variables)}</span>
            <a 
              href={formatVariables(product.url || "#", variables)}
              className="text-sm text-blue-500 hover:underline"
            >
              View Product
            </a>
          </div>
        </div>
      </div>
    );
  };

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
              {renderProduct()}
              
              {template.sections.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  <p>Add components to see the preview</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Preview;
