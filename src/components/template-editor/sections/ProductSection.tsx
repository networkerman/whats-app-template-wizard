
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTemplate } from "@/contexts/TemplateContext";
import DeleteButton from "../DeleteButton";
import { ShoppingCart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ProductSectionProps {
  section: any;
  index: number;
  onDelete: () => void;
}

const ProductSection = ({ section, index, onDelete }: ProductSectionProps) => {
  const { updateSection } = useTemplate();
  
  const handleProductChange = (field: string, value: string) => {
    const updatedProduct = { ...(section.product || {}), [field]: value };
    updateSection(index, { ...section, product: updatedProduct });
  };
  
  const handleRecommendationTypeChange = (value: string) => {
    updateSection(index, { ...section, recommendationType: value });
  };
  
  return (
    <Card>
      <CardHeader className="pb-3 pt-5 px-5">
        <CardTitle className="text-base flex justify-between items-center">
          <div className="flex items-center">
            <ShoppingCart className="w-4 h-4 mr-2" />
            <span>Product</span>
          </div>
          <DeleteButton onDelete={onDelete} />
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Product Type</label>
            <Select 
              value={section.recommendationType || 'static'} 
              onValueChange={handleRecommendationTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="static">Static Product</SelectItem>
                <SelectItem value="best_selling">Best Selling Product</SelectItem>
                <SelectItem value="recently_viewed">Recently Viewed Product</SelectItem>
                <SelectItem value="recommended">Recommended for User</SelectItem>
              </SelectContent>
            </Select>
            {section.recommendationType && section.recommendationType !== 'static' && (
              <p className="text-xs text-gray-500 mt-1">
                This product will be dynamically selected at send time
              </p>
            )}
          </div>
          
          {(!section.recommendationType || section.recommendationType === 'static') && (
            <>
              <div>
                <label className="text-sm font-medium mb-1.5 block">Product Name</label>
                <Input 
                  value={section.product?.name || ''} 
                  onChange={(e) => handleProductChange('name', e.target.value)}
                  placeholder="Product name"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Product Price</label>
                <Input 
                  value={section.product?.price || ''} 
                  onChange={(e) => handleProductChange('price', e.target.value)}
                  placeholder="Price"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Image URL</label>
                <Input 
                  value={section.product?.imageUrl || ''} 
                  onChange={(e) => handleProductChange('imageUrl', e.target.value)}
                  placeholder="https://"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Image should be square, JPEG or PNG, max 5MB
                </p>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Description</label>
                <Textarea 
                  value={section.product?.description || ''} 
                  onChange={(e) => handleProductChange('description', e.target.value)}
                  placeholder="Product description"
                  className="resize-none"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1.5 block">Product URL</label>
                <Input 
                  value={section.product?.url || ''} 
                  onChange={(e) => handleProductChange('url', e.target.value)}
                  placeholder="https://"
                />
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSection;
