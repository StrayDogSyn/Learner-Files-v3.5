import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, X, ChevronDown, Tag, Code } from 'lucide-react';
import { EnhancedProject } from '../../types/projects';

interface ProjectFiltersProps {
  selectedCategories: string[];
  selectedTechnologies: string[];
  onCategoriesChange: (categories: string[]) => void;
  onTechnologiesChange: (technologies: string[]) => void;
  projects: EnhancedProject[];
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  selectedCategories,
  selectedTechnologies,
  onCategoriesChange,
  onTechnologiesChange,
  projects
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'categories' | 'technologies'>('categories');

  // Extract unique categories and technologies from projects
  const { categories, technologies } = useMemo(() => {
    const categoriesSet = new Set<string>();
    const technologiesSet = new Set<string>();

    projects.forEach(project => {
      categoriesSet.add(project.category);
      project.technologies.forEach(tech => technologiesSet.add(tech));
    });

    return {
      categories: Array.from(categoriesSet).sort(),
      technologies: Array.from(technologiesSet).sort()
    };
  }, [projects]);

  // Count projects for each category/technology
  const getCategoryCount = (category: string) => {
    return projects.filter(project => project.category === category).length;
  };

  const getTechnologyCount = (technology: string) => {
    return projects.filter(project => project.technologies.includes(technology)).length;
  };

  const handleCategoryToggle = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(newCategories);
  };

  const handleTechnologyToggle = (technology: string) => {
    const newTechnologies = selectedTechnologies.includes(technology)
      ? selectedTechnologies.filter(t => t !== technology)
      : [...selectedTechnologies, technology];
    onTechnologiesChange(newTechnologies);
  };

  const clearAllFilters = () => {
    onCategoriesChange([]);
    onTechnologiesChange([]);
  };

  const hasActiveFilters = selectedCategories.length > 0 || selectedTechnologies.length > 0;
  const totalActiveFilters = selectedCategories.length + selectedTechnologies.length;

  return (
    <div className="relative">
      {/* Filter Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white hover:bg-white/15 transition-all duration-300 ${
          hasActiveFilters ? 'ring-2 ring-emerald-500/50' : ''
        }`}
      >
        <Filter className="w-5 h-5" />
        <span>Filters</span>
        {totalActiveFilters > 0 && (
          <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            {totalActiveFilters}
          </span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Filter Projects</h3>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>
              
              {/* Tabs */}
              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('categories')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'categories'
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Tag className="w-4 h-4" />
                  Categories
                  {selectedCategories.length > 0 && (
                    <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                      {selectedCategories.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('technologies')}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === 'technologies'
                      ? 'bg-emerald-500 text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <Code className="w-4 h-4" />
                  Technologies
                  {selectedTechnologies.length > 0 && (
                    <span className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
                      {selectedTechnologies.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 max-h-64 overflow-y-auto">
              <AnimatePresence mode="wait">
                {activeTab === 'categories' ? (
                  <motion.div
                    key="categories"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-2"
                  >
                    {categories.map((category) => {
                      const isSelected = selectedCategories.includes(category);
                      const count = getCategoryCount(category);
                      
                      return (
                        <motion.button
                          key={category}
                          onClick={() => handleCategoryToggle(category)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-gray-400'
                            }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-white rounded-sm"
                                />
                              )}
                            </div>
                            <span className="font-medium">{category}</span>
                          </div>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.div
                    key="technologies"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-2"
                  >
                    {technologies.map((technology) => {
                      const isSelected = selectedTechnologies.includes(technology);
                      const count = getTechnologyCount(technology);
                      
                      return (
                        <motion.button
                          key={technology}
                          onClick={() => handleTechnologyToggle(technology)}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all duration-200 ${
                            isSelected
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                              : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                          }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                              isSelected
                                ? 'bg-emerald-500 border-emerald-500'
                                : 'border-gray-400'
                            }`}>
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-2 h-2 bg-white rounded-sm"
                                />
                              )}
                            </div>
                            <span className="font-medium">{technology}</span>
                          </div>
                          <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                            {count}
                          </span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Active Filters:</span>
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedCategories.map((category) => (
                    <span
                      key={`cat-${category}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                    >
                      {category}
                      <button
                        onClick={() => handleCategoryToggle(category)}
                        className="hover:text-blue-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {selectedTechnologies.map((technology) => (
                    <span
                      key={`tech-${technology}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-500/20 text-emerald-300 rounded text-xs"
                    >
                      {technology}
                      <button
                        onClick={() => handleTechnologyToggle(technology)}
                        className="hover:text-emerald-200"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectFilters;