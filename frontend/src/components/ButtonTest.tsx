import React from 'react';
import { Button } from './ui/button';

const ButtonTest: React.FC = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold mb-4">Button Component Test</h2>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Default Variants</h3>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default Button</Button>
          <Button variant="destructive">Destructive Button</Button>
          <Button variant="outline">Outline Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button variant="link">Link Button</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Sizes</h3>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small Button</Button>
          <Button size="default">Default Size</Button>
          <Button size="lg">Large Button</Button>
          <Button size="icon">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5v14"></path>
              <path d="M5 12h14"></path>
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading State</h3>
        <div className="flex flex-wrap gap-4">
          <Button isLoading>Loading Button</Button>
          <Button variant="outline" isLoading>Loading Outline</Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Disabled State</h3>
        <div className="flex flex-wrap gap-4">
          <Button disabled>Disabled Button</Button>
          <Button variant="outline" disabled>Disabled Outline</Button>
        </div>
      </div>
    </div>
  );
};

export default ButtonTest; 