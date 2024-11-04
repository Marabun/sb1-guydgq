import React, { ReactNode } from 'react';

interface TagListProps {
  items: ReactNode[];
}

const TagList: React.FC<TagListProps> = ({ items }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {items}
    </div>
  );
};

export default TagList;