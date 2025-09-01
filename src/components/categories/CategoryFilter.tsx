import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Category } from '../../types/expense.types';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onClearFilters: () => void;
}

export function CategoryFilter({ 
  categories, 
  selectedCategories, 
  onCategoryToggle, 
  onClearFilters 
}: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters = selectedCategories.length > 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Category</span>
          {hasActiveFilters && (
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {selectedCategories.length} selected
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClearFilters}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 hover:text-gray-700"
          >
            {isExpanded ? 'Hide' : 'Show'}
          </Button>
        </div>
      </div>

      {isExpanded && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map((category) => {
              const isSelected = selectedCategories.includes(category.id);
              return (
                <button
                  key={category.id}
                  onClick={() => onCategoryToggle(category.id)}
                  className={`flex items-center space-x-2 p-2 rounded-md text-sm transition-colors ${
                    isSelected
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color || '#6b7280' }}
                  />
                  <span className="truncate">{category.name}</span>
                </button>
              );
            })}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-4 text-gray-500 text-sm">
              No categories available. Create some categories first!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
