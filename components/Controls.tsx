import { INSULATION_TYPES, InsulationMaterial } from "@/lib/constants";

type ControlsProps = {
  material: InsulationMaterial;
  setMaterial: (type: InsulationMaterial) => void;
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
      <h2 className="text-xl font-bold mb-2">Controls</h2>
      <div className="space-y-2">
        <h3 className="font-medium">Insulation</h3>
        <select
          value={material}
          onChange={(e) => setMaterial(e.target.value as InsulationMaterial)}
        >
          {Object.keys(INSULATION_TYPES).map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={thickness}
          onChange={(e) => setThickness(parseFloat(e.target.value))}
        />
        <span>Thickness: {thickness}cm</span>
      </div>
    </>
  );
}
