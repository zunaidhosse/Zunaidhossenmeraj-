
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-light-card/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-2xl shadow-lg p-4 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
