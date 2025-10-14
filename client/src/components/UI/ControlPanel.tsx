import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";

interface ControlPanelProps {
  roomDimensions: {
    width: number;
    length: number;
    height: number;
  };
  setRoomDimensions: (dimensions: { width: number; length: number; height: number }) => void;
}

export default function ControlPanel({ roomDimensions, setRoomDimensions }: ControlPanelProps) {
  const updateDimension = (key: keyof typeof roomDimensions, value: number) => {
    setRoomDimensions({
      ...roomDimensions,
      [key]: Math.max(4, Math.min(40, value))
    });
  };

  return (
    <Card className="absolute top-4 left-4 w-80 bg-white/95 backdrop-blur-sm shadow-lg z-10">
      <CardHeader>
        <CardTitle className="text-lg">Room Dimensions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="width" className="text-sm font-medium">
            Width: {roomDimensions.width} ft
          </Label>
          <div className="flex items-center space-x-2 mt-2">
            <Slider
              id="width"
              min={4}
              max={40}
              step={1}
              value={[roomDimensions.width]}
              onValueChange={([value]) => updateDimension('width', value)}
              className="flex-1"
            />
            <Input
              type="number"
              min={4}
              max={40}
              value={roomDimensions.width}
              onChange={(e) => updateDimension('width', parseInt(e.target.value) || 4)}
              className="w-16 h-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="length" className="text-sm font-medium">
            Length: {roomDimensions.length} ft
          </Label>
          <div className="flex items-center space-x-2 mt-2">
            <Slider
              id="length"
              min={4}
              max={40}
              step={1}
              value={[roomDimensions.length]}
              onValueChange={([value]) => updateDimension('length', value)}
              className="flex-1"
            />
            <Input
              type="number"
              min={4}
              max={40}
              value={roomDimensions.length}
              onChange={(e) => updateDimension('length', parseInt(e.target.value) || 4)}
              className="w-16 h-8"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="height" className="text-sm font-medium">
            Height: {roomDimensions.height} ft
          </Label>
          <div className="flex items-center space-x-2 mt-2">
            <Slider
              id="height"
              min={8}
              max={20}
              step={1}
              value={[roomDimensions.height]}
              onValueChange={([value]) => updateDimension('height', value)}
              className="flex-1"
            />
            <Input
              type="number"
              min={8}
              max={20}
              value={roomDimensions.height}
              onChange={(e) => updateDimension('height', parseInt(e.target.value) || 8)}
              className="w-16 h-8"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
