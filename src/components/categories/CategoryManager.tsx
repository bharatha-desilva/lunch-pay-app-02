import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Category } from '../../types/expense.types';

// Predefined categories
export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt'>[] = [
  { name: 'Food & Dining', color: '#f59e0b' },
  { name: 'Transportation', color: '#3b82f6' },
  { name: 'Entertainment', color: '#8b5cf6' },
  { name: 'Shopping', color: '#ec4899' },
  { name: 'Groceries', color: '#10b981' },
  { name: 'Bills & Utilities', color: '#ef4444' },
  { name: 'Travel', color: '#06b6d4' },
  { name: 'Health & Medical', color: '#f97316' },
  { name: 'Education', color: '#84cc16' },
  { name: 'Other', color: '#6b7280' },
];

// Validation schema for category creation
const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Name too long'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format').optional(),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryManagerProps {
  categories: Category[];
  onCreateCategory?: (data: Omit<Category, 'id' | 'createdAt'>) => void;
  onUpdateCategory?: (data: Category) => void;
  onDeleteCategory?: (categoryId: string) => void;
  isLoading?: boolean;
}

export function CategoryManager({ 
  categories, 
  onCreateCategory,
  onUpdateCategory,
  onDeleteCategory,
  isLoading = false 
}: CategoryManagerProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit = async (data: CategoryFormData) => {
    try {
      if (editingCategory) {
        // Update existing category
        onUpdateCategory?.({
          ...editingCategory,
          ...data,
        });
        setEditingCategory(null);
      } else {
        // Create new category
        onCreateCategory?.({
          name: data.name,
          color: data.color || '#6b7280',
        });
        setIsCreateModalOpen(false);
      }
      reset();
    } catch (error) {
      console.error('Category operation failed:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setValue('name', category.name);
    setValue('color', category.color || '#6b7280');
    setIsCreateModalOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this category? This action cannot be undone.'
    );
    if (confirmDelete) {
      onDeleteCategory?.(categoryId);
    }
  };

  const handleCancel = () => {
    setIsCreateModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  // Color options for category selection
  const colorOptions = [
    '#f59e0b', '#3b82f6', '#8b5cf6', '#ec4899', '#10b981',
    '#ef4444', '#06b6d4', '#f97316', '#84cc16', '#6b7280'
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Expense Categories</CardTitle>
          <CardDescription>
            Manage categories for organizing your expenses
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color || '#6b7280' }}
                  />
                  <span className="font-medium text-gray-900">{category.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(category)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(category.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
            
            {categories.length === 0 && (
              <div className="col-span-2 text-center py-8 text-gray-500">
                No categories yet. Add your first category to get started!
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Category Modal */}
        <Modal 
          isOpen={isCreateModalOpen} 
          onClose={handleCancel}
        >
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </CardTitle>
              <CardDescription>
                {editingCategory 
                  ? 'Update the category details' 
                  : 'Add a new category for organizing expenses'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Category Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Food & Dining"
                    error={errors.name?.message}
                    {...register('name')}
                  />
                </div>

                <div>
                  <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-2">
                    Category Color
                  </label>
                  <div className="space-y-3">
                    {/* Color Picker */}
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setValue('color', color)}
                          className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-400 transition-colors"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    
                    {/* Custom Color Input */}
                    <Input
                      id="color"
                      type="color"
                      className="w-20 h-10"
                      {...register('color')}
                    />
                    {errors.color && (
                      <p className="text-sm text-red-600">{errors.color.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </Modal>
      </CardContent>
    </Card>
  );
}
