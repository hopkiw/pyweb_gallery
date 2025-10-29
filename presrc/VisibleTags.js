import React from 'react';
import { useState } from 'react';

import Tag from './Tag.js';

export default function VisibleTags({ tags, addTagHandler, removeTagHandler }) {
  const tagItems = tags.map((tag) =>
    <Tag
      tag={tag}
      addTagHandler={addTagHandler}
      removeTagHandler={removeTagHandler}
      key={tag}
    />
  );
  return (
    <div id="visible-tags">
      {tagItems}
    </div>
  );
}

