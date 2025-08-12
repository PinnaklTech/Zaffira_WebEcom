import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid2x2, LayoutList } from 'lucide-react';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex border-2 border-gold/30 rounded-2xl overflow-hidden bg-white/50 backdrop-blur-sm">
      <Button
        variant={view === 'grid' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={`rounded-none min-h-[52px] min-w-[52px] transition-all duration-300 ${
          view === 'grid' 
            ? 'bg-gold text-navy shadow-luxury font-bold' 
            : 'text-navy/60 hover:text-navy hover:bg-gold/10'
        }`}
      >
        <Grid2x2 className="h-5 w-5" />
      </Button>
      <Button
        variant={view === 'list' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={`rounded-none min-h-[52px] min-w-[52px] transition-all duration-300 ${
          view === 'list' 
            ? 'bg-gold text-navy shadow-luxury font-bold' 
            : 'text-navy/60 hover:text-navy hover:bg-gold/10'
        }`}
      >
        <LayoutList className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ViewToggle;