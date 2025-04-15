
import { Toaster } from "sonner";
import TemplateEditor from "@/components/template-editor/TemplateEditor";
import { TemplateProvider } from "@/contexts/TemplateContext";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">WhatsApp Template Wizard</h1>
        <TemplateProvider>
          <TemplateEditor />
        </TemplateProvider>
      </div>
    </div>
  );
};

export default Index;
