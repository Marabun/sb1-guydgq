import React, { ReactNode } from 'react';
import { X } from 'lucide-react';

interface DataTagProps {
  children: ReactNode;
  onRemove: () => void;
}

const DataTag: React.FC<DataTagProps> = ({ children, onRemove }) => {
  return (
    <div className="data-tag animate-in">
      {children}
      <button
        onClick={onRemove}
        className="p-0.5 text-gray-400 hover:text-red-500 transition-colors 
                   focus:outline-none focus:ring-2 focus:ring-red-500/20 rounded-md"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default DataTag;