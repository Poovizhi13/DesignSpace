import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { useRef } from "react";
import { 
  Eye, 
  RotateCw, 
  Trash2, 
  RefreshCw, 
  Maximize, 
  Minimize,
  Box,
  Download,
  Upload,
  Grid3x3,
  Undo2,
  Redo2
} from "lucide-react";
import { FurnitureItem } from "../../types/furniture";

interface ToolbarProps {
  viewMode: '2d' | '3d';
  onViewModeChange: (mode: '2d' | '3d') => void;
  onResetScene: () => void;
  selectedFurniture: FurnitureItem | null;
  onDeleteFurniture: (id: string) => void;
  onUpdateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  onSaveLayout: () => void;
  onLoadLayout: (file: File) => void;
  snapToGrid: boolean;
  onSnapToGridChange: (snap: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export default function Toolbar({
  viewMode,
  onViewModeChange,
  onResetScene,
  selectedFurniture,
  onDeleteFurniture,
  onUpdateFurniture,
  onSaveLayout,
  onLoadLayout,
  snapToGrid,
  onSnapToGridChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: ToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleRotate = () => {
    if (selectedFurniture) {
      onUpdateFurniture(selectedFurniture.id, {
        rotation: selectedFurniture.rotation + Math.PI / 4
      });
    }
  };

  const handleScale = (newScale: number[]) => {
    if (selectedFurniture) {
      onUpdateFurniture(selectedFurniture.id, {
        scale: newScale[0]
      });
    }
  };

  const handleDelete = () => {
    if (selectedFurniture) {
      onDeleteFurniture(selectedFurniture.id);
    }
  };

  const handleLoadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onLoadLayout(file);
      e.target.value = '';
    }
  };

  return (
    <Card className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm shadow-lg z-10">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === '3d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('3d')}
            >
              <Box className="w-4 h-4 mr-1" />
              3D
            </Button>
            <Button
              variant={viewMode === '2d' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('2d')}
            >
              <Eye className="w-4 h-4 mr-1" />
              2D
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Furniture Controls */}
          {selectedFurniture ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">
                Selected: {selectedFurniture.type}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleRotate}
              >
                <RotateCw className="w-4 h-4" />
              </Button>

              <div className="flex items-center space-x-2">
                <Minimize className="w-4 h-4" />
                <Slider
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[selectedFurniture.scale]}
                  onValueChange={handleScale}
                  className="w-20"
                />
                <Maximize className="w-4 h-4" />
              </div>

              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <span className="text-sm text-gray-500">
              Click on furniture to select and edit
            </span>
          )}

          <Separator orientation="vertical" className="h-8" />

          {/* Undo/Redo Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onUndo}
              disabled={!canUndo}
            >
              <Undo2 className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onRedo}
              disabled={!canRedo}
            >
              <Redo2 className="w-4 h-4" />
            </Button>
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Grid Snap Toggle */}
          <Button
            variant={snapToGrid ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSnapToGridChange(!snapToGrid)}
          >
            <Grid3x3 className="w-4 h-4 mr-1" />
            Snap
          </Button>

          <Separator orientation="vertical" className="h-8" />

          {/* Save/Load Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveLayout}
            >
              <Download className="w-4 h-4 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadClick}
            >
              <Upload className="w-4 h-4 mr-1" />
              Load
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <Separator orientation="vertical" className="h-8" />

          {/* Reset Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={onResetScene}
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
