
import React from 'react';

const AdminCustomItemsLoadingState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-khrate-500 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading custom buy items...</p>
    </div>
  );
};

export default AdminCustomItemsLoadingState;
