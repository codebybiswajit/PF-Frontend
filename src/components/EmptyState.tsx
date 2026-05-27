import React from 'react';

interface EmptyStateAction {
  label: string;
  onClick: () => void;
}

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  action?: EmptyStateAction;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, action }) => {
  return (
    <div className="empty-state d-flex flex-column align-items-center justify-content-center text-center py-5 px-3">
      <div className="empty-state-icon mb-3" role="img" aria-label={title}>
        {icon}
      </div>
      <h3 className="empty-state-title mb-2">{title}</h3>
      <p className="empty-state-msg mb-4">{message}</p>
      {action && (
        <button className="btn btn-neon px-4" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
