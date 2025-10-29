import React from 'react';
import { useState } from 'react';

import Tag from './Tag.js';

export default function IncludedTags({ tags, removeTagHandler }) {
  const tagItems = tags.map((tag) =>
    <Tag
      tag={tag}
      removeTagHandler={removeTagHandler}
      key={tag}
    />
  );
  return (
    <div id="include-tags">
      {tagItems}
    </div>
  );
}

