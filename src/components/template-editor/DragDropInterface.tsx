import { useDrag, useDrop } from 'react-dnd';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, GripVertical } from "lucide-react";
import { useTemplate } from "@/contexts/TemplateContext";

interface DragItem {
  type: string;
  format?: string;
}

interface DragDropInterfaceProps {
  onAddSection: (type: string, format?: string) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

const DragDropInterface = ({ onAddSection, onReorder }: DragDropInterfaceProps) => {
  const { template } = useTemplate();
  
  const [{ isDragging }, drag] = useDrag({
    type: 'SECTION',
    item: { type: 'SECTION' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: 'SECTION',
    drop: (item: DragItem, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      onAddSection(item.type, item.format);
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('header', 'text')}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Header
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('body')}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Body
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('footer')}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Footer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('buttons')}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Buttons
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddSection('product')}
          className="flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div
        ref={drop}
        className={`min-h-[200px] p-4 rounded-lg border-2 border-dashed ${
          isOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
      >
        {template.sections.length === 0 ? (
          <div className="text-center text-gray-500">
            <p>Drag and drop components here</p>
            <p className="text-sm">or click the buttons above to add sections</p>
          </div>
        ) : (
          <div className="space-y-4">
            {template.sections.map((section, index) => (
              <div
                key={index}
                ref={drag}
                className={`p-4 border rounded-lg bg-white shadow-sm ${
                  isDragging ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="font-medium">{section.type}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {section.format ? `(${section.format})` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DragDropInterface; 