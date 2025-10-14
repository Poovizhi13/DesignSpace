import { AlertCircle, ExternalLink, CheckCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WebGLFallback() {
  const openInNewTab = () => {
    window.open(window.location.href, '_blank');
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <Card className="max-w-3xl shadow-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="flex items-center gap-3 text-3xl">
            <div className="p-2 bg-blue-500 rounded-lg">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            3D Room Designer
          </CardTitle>
          <p className="text-gray-600">Interactive Room & Furniture Layout Tool</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-900">WebGL Not Available in Embedded View</AlertTitle>
            <AlertDescription className="text-amber-800">
              This 3D application requires WebGL to render the 3D environment. 
              WebGL is not available in Replit's embedded webview.
            </AlertDescription>
          </Alert>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-lg text-blue-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Quick Fix - Open in New Tab
            </h3>
            <p className="text-blue-800 text-sm">
              To use the 3D Room Designer, simply open it in a new browser tab where WebGL will work correctly.
            </p>
            <Button 
              onClick={openInNewTab}
              size="lg"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Open in New Tab
            </Button>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Features Available:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Customizable room dimensions (feet)</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">3D & 2D blueprint views</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Furniture placement & editing</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Grid-based measurements</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Rotate, scale, move furniture</span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Real-time 3D preview</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 space-y-2">
            <h4 className="font-semibold text-sm text-gray-900">Alternative: Enable WebGL in Your Browser</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 ml-2">
              <li>Ensure hardware acceleration is enabled in browser settings</li>
              <li>Update your graphics drivers</li>
              <li>Use a modern browser (Chrome, Firefox, Safari, Edge)</li>
              <li>Visit <a href="https://get.webgl.org/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">get.webgl.org</a> to test WebGL support</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
