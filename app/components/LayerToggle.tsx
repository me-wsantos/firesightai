
import { Switch } from './switch';

interface LayerToggleProps {
  icon: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const LayerToggle = ({ icon, label, checked, onChange }: LayerToggleProps) => {
  return (
    <div className="flex items-center justify-between p-3 bg-slate-700 rounded-lg border border-slate-600 hover:bg-slate-600 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-lg">{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        className="data-[state=checked]:bg-orange-500"
      />
    </div>
  );
};
