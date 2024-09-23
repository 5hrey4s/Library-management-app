import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-3xl font-bold">Unauthorized Access</h1>
      <p className="text-lg">You do not have permission to view this page.</p>
    </div>
  );
};

export default Unauthorized;
