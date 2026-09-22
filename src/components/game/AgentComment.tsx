import React from 'react';

interface AgentCommentProps {
  comment: string;
}

const AgentComment: React.FC<AgentCommentProps> = ({ comment }) => {
  return (
    <div className="bg-black text-green-400 border-2 border-green-600 font-mono p-4 mb-4 flex items-center gap-3 shadow-lg animate-pulse rounded-none">
      <span role="img" aria-label="AI Agent" className="text-2xl">🤖</span>
      <span>{comment}</span>
    </div>
  );
};

export default AgentComment; 