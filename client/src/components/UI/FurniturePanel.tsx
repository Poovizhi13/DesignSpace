import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { FurnitureType, FurnitureCategory } from "../../types/furniture";
import { Sofa, Armchair, Bed, BookOpen, Laptop, Table } from "lucide-react";

interface FurniturePanelProps {
  onAddFurniture: (type: FurnitureType) => void;
}

const furnitureCategories: FurnitureCategory[] = [
  {
    name: "Seating",
    items: [
      { type: "chair", name: "Dining Chair", description: "Simple wooden chair" },
      { type: "sofa", name: "Sofa", description: "Comfortable 2-seater" },
      { type: "armchair", name: "Armchair", description: "Cozy single seat" }
    ]
  },
  {
    name: "Tables",
    items: [
      { type: "table", name: "Dining Table", description: "Rectangular table" },
      { type: "desk", name: "Desk", description: "Office desk with drawers" }
    ]
  },
  {
    name: "Storage",
    items: [
      { type: "bookshelf", name: "Bookshelf", description: "5-shelf storage unit" }
    ]
  },
  {
    name: "Bedroom",
    items: [
      { type: "bed", name: "Bed", description: "Standard double bed" }
    ]
  }
];

const getIconForType = (type: FurnitureType) => {
  const iconProps = { className: "w-4 h-4" };
  switch (type) {
    case 'sofa':
    case 'armchair':
      return <Sofa {...iconProps} />;
    case 'chair':
      return <Armchair {...iconProps} />;
    case 'bed':
      return <Bed {...iconProps} />;
    case 'bookshelf':
      return <BookOpen {...iconProps} />;
    case 'desk':
      return <Laptop {...iconProps} />;
    case 'table':
      return <Table {...iconProps} />;
    default:
      return null;
  }
};

export default function FurniturePanel({ onAddFurniture }: FurniturePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Seating");
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureType>("chair");

  const currentCategory = furnitureCategories.find(cat => cat.name === selectedCategory);
  const currentItems = currentCategory?.items || [];

  const handleAddFurniture = () => {
    onAddFurniture(selectedFurniture);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    const newCategory = furnitureCategories.find(cat => cat.name === category);
    if (newCategory && newCategory.items.length > 0) {
      setSelectedFurniture(newCategory.items[0].type);
    }
  };

  return (
    <Card className="absolute top-4 right-4 w-80 bg-black text-white shadow-lg z-10">
      <CardHeader>
        <CardTitle className="text-lg">Add Furniture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              {furnitureCategories.map((category) => (
                <SelectItem key={category.name} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Item</label>
          <Select 
            value={selectedFurniture} 
            onValueChange={(value: FurnitureType) => setSelectedFurniture(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black text-white">
              {currentItems.map((item) => (
                <SelectItem key={item.type} value={item.type}>
                  <div className="flex items-center gap-2">
                    {getIconForType(item.type)}
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      {item.description && (
                        <span className="text-xs text-gray-400">{item.description}</span>
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleAddFurniture} className="w-full">
          Add to Room
        </Button>
      </CardContent>
    </Card>
  );
}
