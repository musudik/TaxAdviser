import React from 'react';

// Create simple components to replace UI components
export const Label = ({ 
  htmlFor, 
  children, 
  className = "",
  germanText,
  englishText 
}: { 
  htmlFor?: string; 
  children?: React.ReactNode;
  className?: string;
  germanText?: React.ReactNode;
  englishText?: React.ReactNode;
}) => {
  if (germanText || englishText) {
    return (
      <label 
        htmlFor={htmlFor} 
        className={`block text-sm font-medium text-neutral-700 mb-1 ${className}`}
      >
        {germanText}
        {germanText && englishText && " "}
        {englishText}
      </label>
    );
  }

  return (
    <label 
      htmlFor={htmlFor} 
      className={`block text-sm font-medium text-neutral-700 mb-1 ${className}`}
    >
      {children}
    </label>
  );
};

export const FormSection = ({ 
  title, 
  children,
  className = "",
  germanTitle,
  englishTitle
}: { 
  title?: string; 
  children: React.ReactNode;
  className?: string;
  germanTitle?: string;
  englishTitle?: string;
}) => {
  const sectionTitle = germanTitle && englishTitle ? 
    <><span className="font-bold">{germanTitle}</span> / <span className="text-neutral-600">{englishTitle}</span></> :
    title;

  return (
    <div className={`mb-6 p-4 border border-neutral-200 rounded-md ${className}`}>
      <h3 className="text-lg font-medium text-neutral-800 mb-3">{sectionTitle}</h3>
      {children}
    </div>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  name?: string;
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;  // Add support for file input accept attribute
}

export const Input = ({
  id,
  name,
  type = "text",
  value,
  onChange,
  className = "",
  placeholder = "",
  required = false,
  disabled = false,
  min,
  max,
  step
}: InputProps) => (
  <input
    id={id}
    name={name}
    type={type}
    value={value}
    onChange={onChange}
    className={`auth-input ${className}`}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    min={min}
    max={max}
    step={step}
  />
);

export const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  className = "", 
  disabled = false 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  type?: "button" | "submit" | "reset"; 
  className?: string;
  disabled?: boolean;
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-md transition-colors ${className}`}
  >
    {children}
  </button>
);

export const Select = ({
  id,
  name,
  value,
  onChange,
  children,
  className = "",
  required = false,
  disabled = false
}: {
  id?: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}) => (
  <div className="auth-select-container">
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`auth-select ${className}`}
      required={required}
      disabled={disabled}
    >
      {children}
    </select>
  </div>
); 