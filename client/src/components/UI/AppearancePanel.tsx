import { useRoomDesigner } from '../../hooks/useRoomDesigner'

export default function AppearancePanel() {
  const { wallColor, setWallColor, floorTexture, setFloorTexture } = useRoomDesigner()

  const textures = [
    { name: 'Wood', path: '/textures/wood_floor.jpg' },
    { name: 'grass', path: '/textures/grass.png' },
  ]

  return (
    <div className="p-4 bg-white rounded shadow space-y-3">
      <h3 className="font-semibold text-gray-700">Room Appearance</h3>

      <div>
        <label className="block text-sm text-gray-600">Wall Color</label>
        <input
          type="color"
          value={wallColor}
          onChange={(e) => setWallColor(e.target.value)}
          className="w-16 h-8 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">Floor Texture</label>
        <select
          value={floorTexture}
          onChange={(e) => setFloorTexture(e.target.value)}
          className="border rounded p-1 w-full"
        >
          {textures.map((t) => (
            <option key={t.path} value={t.path}>
              {t.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
