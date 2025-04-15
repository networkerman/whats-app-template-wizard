import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTemplate } from "@/contexts/TemplateContext";
import TemplateHeader from "./TemplateHeader";
import DragDropInterface from "./DragDropInterface";
import VariableEditor from "./VariableEditor";
import ApprovalWorkflow from "./ApprovalWorkflow";
import Preview from "./Preview";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const TemplateEditor = () => {
  const [activeTab, setActiveTab] = useState<string>("edit");
  const { template, validateTemplate, saveTemplate, reorderSections, addSection } = useTemplate();
  const [previewVariables, setPreviewVariables] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const validationResult = validateTemplate();
    if (validationResult.valid) {
      try {
        await saveTemplate();
        toast.success("Template saved successfully!");
      } catch (error) {
        toast.error("Failed to save template");
      }
    } else {
      toast.error(`Template has errors: ${validationResult.message}`);
    }
  };

  const handleVariablesChange = (variables: Record<string, string>) => {
    setPreviewVariables(variables);
  };

  const handleAddSection = (type: string, format?: string) => {
    try {
      addSection(type, format);
      toast.success(`${type} section added successfully`);
    } catch (error) {
      toast.error(`Failed to add ${type} section`);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
                  <TabsTrigger value="variables" className="data-[state=active]:bg-white data-[state=active]:shadow-none">
                    Variables
                  </TabsTrigger>
                  <TabsTrigger value="approval" className="data-[state=active]:bg-white data-[state=active]:shadow-none">
                    Approval
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="edit" className="p-0 m-0">
                <div className="p-6">
                  <DragDropInterface 
                    onAddSection={handleAddSection}
                    onReorder={reorderSections}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="variables" className="p-6 m-0">
                <VariableEditor onVariablesChange={handleVariablesChange} />
              </TabsContent>
              
              <TabsContent value="approval" className="p-6 m-0">
                <ApprovalWorkflow />
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
              <Preview variables={previewVariables} />
            </div>
          </Card>
        </div>
      </div>
    </DndProvider>
  );
};

export default TemplateEditor;
