import React from "react";

const Container = ({ children }) => {
  return ( 
    <div className="mx-auto w-full max-w-3xl">
      {children}
    </div>
   );
};

export default Container;
