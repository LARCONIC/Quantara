import React from 'react';

export interface Tag {
  name: string;
  color: string;
  description: string;
}

interface TagProps {
  tag: string;
  variant?: 'default' | 'status';
  size?: 'sm' | 'md';
}

interface TagSystemProps {
  tags: string[];
  status?: 'live' | 'beta' | 'prototype' | 'graduated' | 'coming-soon';
  variant?: 'default' | 'status';
  size?: 'sm' | 'md';
}

const getStatusConfig = (status: string) => {
  const configs = {
    live: { color: 'bg-green-500/20 text-green-400 border-green-500/30', label: 'Live' },
    beta: { color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', label: 'Beta' },
    prototype: { color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', label: 'Prototype' },
    graduated: { color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', label: 'Graduated' },
    'coming-soon': { color: 'bg-orange-500/20 text-orange-400 border-orange-500/30', label: 'Coming Soon' },
  };
  return configs[status as keyof typeof configs] || configs.prototype;
};

const Tag: React.FC<TagProps> = ({ tag, variant = 'default', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';
  
  if (variant === 'status') {
    const config = getStatusConfig(tag);
    return (
      <span className={`inline-flex items-center rounded-full border ${config.color} ${sizeClasses} font-medium`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5"></span>
        {config.label}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-white/10 text-white/80 border border-white/20 hover:bg-white/20 transition-colors ${sizeClasses} font-medium`}>
      {tag}
    </span>
  );
};

const TagSystem: React.FC<TagSystemProps> = ({ tags, status, variant = 'default', size = 'sm' }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {status && (
        <Tag tag={status} variant="status" size={size} />
      )}
      {tags.map((tag, index) => (
        <Tag key={index} tag={tag} variant={variant} size={size} />
      ))}
    </div>
  );
};

export default TagSystem;
export { Tag };