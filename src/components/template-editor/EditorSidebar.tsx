
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Sparkles, Image, TextIcon, ShoppingCart, LayoutList, Columns, Lock } from "lucide-react";
import { useTemplate } from "@/contexts/TemplateContext";

const EditorSidebar = () => {
  const { addSection } = useTemplate();
  
  const sections = [
    { 
      type: "header", 
      title: "Header", 
      description: "Add an optional header to your message",
      icon: <Sparkles className="h-4 w-4" />,
      options: ["text", "image", "video"] 
    },
    { 
      type: "body", 
      title: "Body", 
      description: "Main text content of your message",
      icon: <TextIcon className="h-4 w-4" />,
      options: ["text"] 
    },
    { 
      type: "footer", 
      title: "Footer", 
      description: "Add an optional footer text",
      icon: <LayoutList className="h-4 w-4" />,
      options: ["text"] 
    },
    { 
      type: "buttons", 
      title: "Buttons", 
      description: "Add interactive buttons",
      icon: <Columns className="h-4 w-4" />,
      options: ["url", "phone", "quick_reply"] 
    },
    { 
      type: "product", 
      title: "Product", 
      description: "Showcase a single product",
      icon: <ShoppingCart className="h-4 w-4" />,
      options: ["single_product"] 
    },
    { 
      type: "products", 
      title: "Products", 
      description: "Display multiple products in a carousel",
      icon: <ShoppingCart className="h-4 w-4" />,
      options: ["multi_product"] 
    },
    { 
      type: "authentication", 
      title: "Authentication", 
      description: "Add an authentication component",
      icon: <Lock className="h-4 w-4" />,
      options: ["auth"] 
    },
  ];

  return (
    <ScrollArea className="h-full p-4">
      <div className="space-y-4">
        <div className="mb-6">
          <h3 className="font-medium text-sm mb-2">Template Components</h3>
          <p className="text-xs text-gray-500">Drag or click to add to your template</p>
        </div>

        {sections.map((section) => (
          <div 
            key={section.type}
            className="p-4 border rounded-md bg-white hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => addSection(section.type, section.options[0])}
          >
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mr-3">
                {section.icon}
              </div>
              <h4 className="font-medium text-sm">{section.title}</h4>
            </div>
            <p className="text-xs text-gray-500 ml-11">{section.description}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default EditorSidebar;
