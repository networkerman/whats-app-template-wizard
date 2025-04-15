
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import EditorSidebar from "./EditorSidebar";
import EditorContent from "./EditorContent";
import Preview from "./Preview";
import { useTemplate } from "@/contexts/TemplateContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import TemplateHeader from "./TemplateHeader";

const TemplateEditor = () => {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const { template, validateTemplate } = useTemplate();

  const handleSave = () => {
    const validationResult = validateTemplate();
    if (validationResult.valid) {
      toast.success("Template saved successfully!");
    } else {
      toast.error(`Template has errors: ${validationResult.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <Card className="overflow-hidden border-none shadow-md">
          <TemplateHeader />
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="border-b px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="edit" className="data-[state=active]:bg-white data-[state=active]:shadow-none">
                  Edit Template
                </TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-white data-[state=active]:shadow-none">
                  Template JSON
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="edit" className="p-0 m-0">
              <div className="grid grid-cols-12 h-[calc(100vh-230px)]">
                <div className="col-span-4 border-r bg-gray-50">
                  <EditorSidebar />
                </div>
                <div className="col-span-8 overflow-auto">
                  <EditorContent />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="code" className="p-6 m-0">
              <pre className="bg-gray-100 p-4 rounded-md overflow-auto h-[calc(100vh-300px)]">
                {JSON.stringify(template, null, 2)}
              </pre>
            </TabsContent>
          </Tabs>
        </Card>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline">Cancel</Button>
          <Button onClick={handleSave}>Save Template</Button>
        </div>
      </div>
      <div className="lg:col-span-4">
        <Card className="h-full border-none shadow-md">
          <div className="p-6 border-b">
            <h3 className="font-semibold">Preview</h3>
            <p className="text-sm text-gray-500">See how your template will appear in WhatsApp</p>
          </div>
          <div className="p-6 bg-gray-50 h-[calc(100vh-200px)] overflow-auto">
            <Preview />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TemplateEditor;
