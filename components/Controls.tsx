import { INSULATION_TYPES, InsulationType } from '@/lib/constants';

type ControlsProps = {
  material: InsulationType;
  setMaterial: (type: InsulationType) => void;
  thickness: number;
  setThickness: (thickness: number) => void;
  yPlane: number;
  setYPlane: (zHeight: number) => void;
  resolution: number;
  setResolution: (resolution: number) => void;
  grid: boolean;
  setGrid: (grid: boolean) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
};

export default function Controls({
  material,
  setMaterial,
  thickness,
  setThickness,
  yPlane,
  setYPlane,
  resolution,
  setResolution,
  grid,
  setGrid,
  enabled,
  setEnabled,
}: ControlsProps) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Controls</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Insulation Type
        </label>
        <select
          className="w-full p-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
          value={material}
          onChange={(e) => setMaterial(e.target.value as InsulationType)}
        >
          {Object.keys(INSULATION_TYPES).map((type) => (
            <option key={type} value={type} className="text-gray-800">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Thickness</label>
          <span className="text-sm font-semibold">{thickness} cm</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={thickness}
          onChange={(e) => setThickness(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>10cm</span>
          <span>100cm</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Z height</label>
          <span className="text-sm font-semibold">{yPlane}</span>
        </div>
        <input
          type="range"
          min="-1"
          max="1"
          step="0.1"
          value={yPlane}
          onChange={(e) => setYPlane(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>-1</span>
          <span>1</span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium">Resolution</label>
          <span className="text-sm font-semibold">{resolution}</span>
        </div>
        <input
          type="range"
          min="5"
          max="100"
          step="1"
          value={resolution}
          onChange={(e) => setResolution(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs mt-1">
          <span>5</span>
          <span>100</span>
        </div>
      </div>

      <div className="flex items-center mt-4">
        <input
          type="checkbox"
          id="show-grid"
          checked={grid}
          onChange={(e) => setGrid(e.target.checked)}
          className="h-4 w-4 border-gray-300 rounded"
        />
        <label htmlFor="show-grid" className="ml-2 block text-sm">
          Show Grid
        </label>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setEnabled(!enabled)}
          className={`px-4 py-2 bg-${enabled ? 'red' : 'blue'}-600 text-white rounded-md hover:bg-${enabled ? 'red' : 'blue'}-700 focus:outline-none`}
        >
          {enabled ? 'Stop simulation' : 'Start simulation'}
        </button>
      </div>

      <div
        className="mt-4 p-3 rounded-md"
        style={{ backgroundColor: INSULATION_TYPES[material].color }}
      >
        <p className="text-sm text-gray-700 font-semibold">
          {INSULATION_TYPES[material].name}
        </p>
        <p className="text-sm text-gray-700">
          λ={' '}
          <span className="font-semibold">
            {INSULATION_TYPES[material].conductivity}
          </span>{' '}
          W/mK
        </p>
      </div>
    </>
  );
}
