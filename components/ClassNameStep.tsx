import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';

export function ClassNameStep({ className, setClassName }: { className: string, setClassName: (className: string) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Class Name</h2>
      <Input
        placeholder="Enter Class Name"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
      />
      <div className="flex items-center space-x-2">
        <Checkbox id="continueClass" />
        <label htmlFor="continueClass">Continue uploading to this class</label>
      </div>
    </div>
  );
}
