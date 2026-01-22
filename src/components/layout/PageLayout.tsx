import React, { ReactNode } from 'react';

interface PageLayoutProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  searchAndFilters?: ReactNode;
  children: ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  description,
  actions,
  searchAndFilters,
  children,
  className = '',
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-4">{actions}</div>}
      </div>

      {/* Search and Filters Section */}
      {searchAndFilters && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          {searchAndFilters}
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default PageLayout; 