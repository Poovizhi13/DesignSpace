# 3D Room & Furniture Designer

A web-based 3D interactive room modeling tool where users can design and customize room layouts and add furniture models. Built with React, Three.js, and TypeScript.

## Features

### ✨ Core Functionality

- **Customizable Room Dimensions**: Define room width, length, and height in feet (4-40 ft width/length, 8-20 ft height)
- **3D Room Rendering**: Visible floor and semi-transparent walls with realistic lighting
- **Grid-based Measurements**: Visual 1-foot grid system for precise placement
- **Furniture Management**: Place, move, rotate, scale, and delete furniture items
- **2D/3D View Toggle**: Switch between perspective 3D view and top-down orthographic blueprint view
- **Interactive Controls**: OrbitControls for camera manipulation (pan, zoom, rotate)

### 🪑 Furniture Catalog

Current furniture items (placeholder geometric shapes):
- **Bed**: Brown mattress with headboard
- **Chair**: Seat with backrest and legs
- **Table**: Tabletop with four legs
- **Sofa**: Blue couch with armrests and backrest

All furniture is organized by categories:
- Seating (Chair, Sofa)
- Storage (Table)
- Bedroom (Bed)

### 🎮 Controls

**Room Controls:**
- Adjust dimensions using sliders or number inputs
- Real-time updates with live preview

**Furniture Controls:**
- Click furniture to select
- Drag to move along floor plane (X/Z axis)
- Rotate in 45° increments using toolbar button
- Scale from 0.5x to 2x using toolbar slider
- Delete selected furniture with delete button

**Camera Controls:**
- 3D Mode: Pan, zoom, and rotate freely
- 2D Mode: Top-down view with pan and zoom only
- Toggle between modes using toolbar buttons

## Technical Stack

- **React 18** - UI framework
- **Three.js** - 3D rendering
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers and controls
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Accessible UI components
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 20+
- Modern browser with WebGL support

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### WebGL Requirement

This application requires WebGL to render the 3D environment. If you see a "WebGL Not Available" message:

1. **In Replit**: Click the "Open in new tab" button in the webview toolbar
2. **In Browser**: Ensure hardware acceleration is enabled
3. **Verify WebGL**: Visit [https://get.webgl.org/](https://get.webgl.org/) to test WebGL support

## Project Structure

```
client/
├── src/
│   ├── components/
│   │   ├── UI/
│   │   │   ├── ControlPanel.tsx    # Room dimension controls
│   │   │   ├── FurniturePanel.tsx  # Furniture selection
│   │   │   └── Toolbar.tsx         # View mode and furniture tools
│   │   ├── Furniture.tsx           # Furniture 3D models
│   │   ├── Grid.tsx                # Floor grid system
│   │   ├── Room.tsx                # Room walls and floor
│   │   ├── RoomDesigner.tsx        # Main 3D scene
│   │   └── WebGLFallback.tsx       # WebGL error handling
│   ├── hooks/
│   │   └── useRoomDesigner.tsx     # Room state management
│   ├── types/
│   │   └── furniture.ts            # TypeScript definitions
│   └── App.tsx                      # Root component
└── public/
    └── textures/                    # Texture assets
```

## Customization

### Adding New Furniture

The current implementation uses geometric placeholders that are ready to be replaced with .glb models:

1. Add .glb model files to `client/public/models/`
2. Update `client/src/types/furniture.ts` to include new furniture types
3. Update `client/src/components/Furniture.tsx` to load and render .glb models
4. Add new categories in `client/src/components/UI/FurniturePanel.tsx`

Example structure for .glb support:

```typescript
// Use GLTFLoader from drei
import { useGLTF } from '@react-three/drei';

function FurnitureModel({ type }: { type: string }) {
  const { scene } = useGLTF(`/models/${type}.glb`);
  return <primitive object={scene} />;
}
```

### Room Constraints

- Minimum room size: 4ft x 4ft x 8ft
- Maximum room size: 40ft x 40ft x 20ft
- Furniture is automatically constrained within room bounds

## Features for Future Enhancement

- [ ] Replace geometric placeholders with .glb furniture models
- [ ] Expanded furniture catalog with more categories
- [ ] Save/Load room layouts as JSON
- [ ] Real-time distance measurements (from walls, between objects)
- [ ] Furniture snapping to grid
- [ ] Undo/Redo functionality
- [ ] Texture/material customization for walls and furniture
- [ ] Export room as image or 3D file
- [ ] Collision detection between furniture pieces
- [ ] Wall-mounted furniture support
- [ ] Custom furniture upload

## Browser Compatibility

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

WebGL 1.0 or higher required.

## License

MIT
