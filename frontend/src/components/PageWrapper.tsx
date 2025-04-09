import React from 'react';

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div style={{ paddingTop: '80px' }}>
      {children}
    </div>
  );
};

export default PageWrapper;
