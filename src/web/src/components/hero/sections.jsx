import React from 'react';

function Sections() {
  return (
    <div className="relative h-screen overflow-y-scroll">
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-gray-700">hello.</h1>
      </div>
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-orange-400">Your Future</h1>
      </div>
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-indigo-800">Awaits</h1>
      </div>
    </div>
  );
}

export default Sections;
