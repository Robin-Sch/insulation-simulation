import { INSULATION_TYPES, InsulationType } from '@/lib/constants';

type ControlsProps = {
  material: InsulationType;
  setMaterial: (type: InsulationType) => void;
  thickness: number;
  setThickness: (thickness: number) => void;
};

export default function Controls({
  material,
  setMaterial,
  thickness,
  setThickness,
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
