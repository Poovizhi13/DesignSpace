# 3D Room & Furniture Designer

## Project Overview

**Type:** Web-based 3D Room Designer Application  
**Stack:** React + Three.js + TypeScript  
**Last Updated:** October 14, 2025

### Purpose
An interactive 3D modeling tool for designing room layouts and placing furniture. Users can customize room dimensions in feet, add furniture items, and view their design in both 3D perspective and 2D blueprint views.

### Current State
✅ **MVP Complete** - All core features implemented and functional:
- Room dimension controls (width, length, height in feet)
- 3D room visualization with floor, walls, and lighting
- Grid-based measurement system (1-foot increments)
- Four furniture types with geometric placeholders (bed, chair, table, sofa)
- Furniture manipulation (move, rotate, scale, delete)
- 2D/3D view switching
- WebGL detection with fallback UI

## Recent Changes

### October 14, 2025
- ✅ Implemented complete 3D room designer MVP
- ✅ Created room dimension control panel with sliders and inputs
- ✅ Built furniture placement system with drag-and-drop
- ✅ Added 2D/3D view toggle with OrbitControls
- ✅ Implemented grid-based measurement system
- ✅ Created toolbar with furniture controls (rotate, scale, delete)
- ✅ Added WebGL detection and fallback UI for unsupported environments
- ✅ Structured code for easy .glb model replacement

## Project Architecture

### Frontend Structure
```
client/src/
├── components/
│   ├── UI/                    # User interface panels
│   │   ├── ControlPanel.tsx   # Room dimensions
│   │   ├── FurniturePanel.tsx # Furniture selection
│   │   └── Toolbar.tsx        # View mode & furniture tools
│   ├── Furniture.tsx          # Furniture 3D models (geometric placeholders)
│   ├── Grid.tsx               # Floor grid visualization
│   ├── Room.tsx               # Room walls and floor
│   ├── RoomDesigner.tsx       # Main 3D scene container
│   └── WebGLFallback.tsx      # WebGL error handling
├── hooks/
│   └── useRoomDesigner.tsx    # Room state management
├── types/
│   └── furniture.ts           # TypeScript type definitions
└── App.tsx                    # Root component with WebGL detection
```

### Key Technologies
- **@react-three/fiber**: React renderer for Three.js
- **@react-three/drei**: OrbitControls, GizmoHelper, utilities
- **@use-gesture/react**: Drag interactions for furniture
- **Radix UI**: Accessible UI components (sliders, buttons, cards)
- **Tailwind CSS**: Utility-first styling

### State Management
- Custom hook `useRoomDesigner` manages:
  - Room dimensions
  - Furniture array with positions, rotations, scales
  - Selected furniture state
  - View mode (2D/3D)

## How It Works

### Room Dimensions
- User inputs: 4-40 ft (width/length), 8-20 ft (height)
- 1:1 mapping: 1 foot = 1 Three.js unit
- Real-time updates with constraints

### Furniture System
- **Geometric placeholders**: Box and cylinder primitives
- **Position**: [x, y, z] coordinates (y=0 for floor placement)
- **Rotation**: Y-axis rotation in radians
- **Scale**: Uniform scaling (0.5x to 2x)
- **Bounds checking**: Constrained within room dimensions

### View Modes
- **3D Mode**: Perspective camera with full orbit controls
- **2D Mode**: Orthographic top-down view, rotation locked

## Future Enhancements

### Planned Features
1. **Model Integration**: Replace geometric shapes with .glb furniture models
2. **Extended Catalog**: More furniture types and categories
3. **Save/Load**: JSON export/import of room layouts
4. **Measurements**: Real-time distance display from walls
5. **Grid Snapping**: Align furniture to grid
6. **Undo/Redo**: Action history management
7. **Materials**: Wall and furniture texture customization

### How to Add .glb Models
```typescript
// 1. Add models to client/public/models/
// 2. Update Furniture.tsx to use GLTFLoader:

import { useGLTF } from '@react-three/drei';

function FurnitureModel({ type }) {
  const { scene } = useGLTF(`/models/${type}.glb`);
  return <primitive object={scene} />;
}
```

## Known Issues & Notes

### WebGL Requirement
- **Issue**: Replit's embedded webview may not support WebGL
- **Solution**: App detects WebGL and shows fallback message
- **Workaround**: Open in new browser tab for full functionality

### Performance
- Optimized for rooms up to 40x40 ft
- Grid divisions scale with room size
- Shadows enabled for realism (can be disabled for performance)

## Development Guidelines

### Adding Furniture Types
1. Add type to `furniture.ts`: `export type FurnitureType = 'bed' | 'chair' | 'table' | 'sofa' | 'NEW_TYPE';`
2. Add geometry to `Furniture.tsx` in `getFurnitureGeometry()`
3. Add to category in `FurniturePanel.tsx`

### Modifying Room Constraints
Edit `ControlPanel.tsx`:
```typescript
min={4}  // Minimum dimension
max={40} // Maximum dimension
```

### Camera Positioning
Adjust in `RoomDesigner.tsx`:
```typescript
camera={{ 
  position: [roomWidth * 0.8, roomHeight * 0.8, roomLength * 0.8],
  fov: 60 
}}
```

## User Preferences

None specified yet.

## Dependencies

### Core 3D Libraries
- `three`: ^0.170.0
- `@react-three/fiber`: ^8.18.0
- `@react-three/drei`: ^9.122.0

### UI Libraries
- `@radix-ui/*`: Various component packages
- `tailwindcss`: ^3.4.14
- `lucide-react`: ^0.453.0

### Development
- `typescript`: 5.6.3
- `vite`: ^5.4.19
- `tsx`: ^4.19.1

## Running the Project

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start
```

Server runs on port 5000 (Express + Vite dev server)
