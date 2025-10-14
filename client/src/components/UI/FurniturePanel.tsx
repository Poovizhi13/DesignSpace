import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { FurnitureType } from "../../types/furniture";

interface FurniturePanelProps {
  onAddFurniture: (type: FurnitureType) => void;
}

const furnitureCategories = {
  "Seating": [
    { type: "chair" as FurnitureType, name: "Chair" },
    { type: "sofa" as FurnitureType, name: "Sofa" }
  ],
  "Storage": [
    { type: "table" as FurnitureType, name: "Table" }
  ],
  "Bedroom": [
    { type: "bed" as FurnitureType, name: "Bed" }
  ]
};

export default function FurniturePanel({ onAddFurniture }: FurniturePanelProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Seating");
  const [selectedFurniture, setSelectedFurniture] = useState<FurnitureType>("chair");

  const currentItems = furnitureCategories[selectedCategory as keyof typeof furnitureCategories] || [];

  const handleAddFurniture = () => {
    onAddFurniture(selectedFurniture);
  };

  return (
    <Card className="absolute top-4 right-4 w-80 bg-white/95 backdrop-blur-sm shadow-lg z-10">
      <CardHeader>
        <CardTitle className="text-lg">Add Furniture</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Category</label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(furnitureCategories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
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
            <SelectContent>
              {currentItems.map((item) => (
                <SelectItem key={item.type} value={item.type}>
                  {item.name}
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
