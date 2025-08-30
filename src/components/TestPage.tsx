import React from 'react';

const TestPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Test Page - Ride Rental</h1>
      <p>If you can see this page, React is working correctly.</p>
      
      <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h2>Debugging Information</h2>
        <ul>
          <li>React is loaded correctly</li>
          <li>Routes are working</li>
          <li>No issues with the basic configuration</li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;
