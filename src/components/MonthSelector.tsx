import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { createPortal } from 'react-dom';

interface MonthSelectorProps {
  value: number;
  onChange: (value: number) => void;
  initialMaxMonths?: number;
  monthsPerPage?: number;
  variant?: 'default' | 'minimal';
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  value,
  onChange,
  initialMaxMonths = 24,
  monthsPerPage = 12,
  variant = 'default'
}) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [displayedMonths, setDisplayedMonths] = useState<number[]>([]);
  const [showingUpTo, setShowingUpTo] = useState(monthsPerPage);
  const [maxMonths, setMaxMonths] = useState(initialMaxMonths);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    updateDisplayedMonths();
  }, [showingUpTo]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const updateDropdownPosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', updateDropdownPosition);
    window.addEventListener('resize', updateDropdownPosition);

    updateDropdownPosition();

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updateDropdownPosition);
      window.removeEventListener('resize', updateDropdownPosition);
    };
  }, [isOpen]);

  const updateDisplayedMonths = () => {
    const months = Array.from({ length: showingUpTo }, (_, i) => i + 1);
    setDisplayedMonths(months);
  };

  const handleShowMore = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextShowingUpTo = showingUpTo + monthsPerPage;
    
    if (showingUpTo === monthsPerPage) {
      setShowingUpTo(nextShowingUpTo);
    } else if (showingUpTo === monthsPerPage * 2) {
      setMaxMonths(initialMaxMonths * 2);
      setShowingUpTo(monthsPerPage * 4);
    } else {
      setShowingUpTo(monthsPerPage);
      setMaxMonths(initialMaxMonths);
    }
  };

  const toggleDropdown = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width
      });
    }
    setIsOpen(!isOpen);
  };

  const renderDropdown = () => {
    if (!isOpen) return null;

    const dropdown = (
      <div
        ref={dropdownRef}
        className="fixed z-50 bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-xl shadow-lg animate-in"
        style={{
          top: dropdownPosition.top + 8,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
        }}
      >
        <div className="p-3">
          <div className="grid grid-cols-4 gap-2">
            {displayedMonths.map(month => (
              <button
                key={month}
                onClick={() => {
                  onChange(month);
                  setIsOpen(false);
                }}
                className={`p-2 text-center rounded-lg transition-colors ${
                  month === value 
                    ? 'bg-blue-100 text-blue-700 font-semibold' 
                    : 'hover:bg-gray-100'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
          <button
            onClick={handleShowMore}
            className="w-full mt-2 py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center gap-1"
          >
            <span>{showingUpTo === monthsPerPage ? t('showMore') : 
                   showingUpTo === monthsPerPage * 2 ? t('showMoreMonths') : 
                   t('backToStart')}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    );

    return createPortal(dropdown, document.body);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={
          variant === 'minimal'
            ? 'flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors'
            : 'w-full px-4 py-2 text-left bg-white/70 backdrop-blur-xl border border-gray-200/80 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/30 flex justify-between items-center'
        }
      >
        <span className={variant === 'minimal' ? 'font-medium' : ''}>
          {value} {value === 1 ? t('month') : t('months')}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {renderDropdown()}
    </div>
  );
};

export default MonthSelector;