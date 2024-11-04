import React, { ReactNode } from 'react';

interface InputCardProps {
  title: string;
  children: ReactNode;
  icon?: ReactNode;
}

const InputCard: React.FC<InputCardProps> = ({ title, children, icon }) => {
  return (
    <div className="card p-6 hover:scale-[1.01] transition-transform">
      <h3 className="section-title mb-6 flex items-center gap-2">
        {icon}
        <span>{title}</span>
      </h3>
      {children}
    </div>
  );
};

export default InputCard;