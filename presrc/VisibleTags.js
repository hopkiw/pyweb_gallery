import React from 'react';
import { useState } from 'react';

import Tag from './Tag.js';

export default function VisibleTags({ tags, addTagHandler }) {
  var tagItems = [];
  if (Array.isArray(tags)) {
    tagItems = tags.map((tag) =>
      <Tag
        tag={tag}
        addTagHandler={addTagHandler}
        key={tag}
      />
    );
  }
  return (
    <div id="visible-tags">
      {tagItems}
    </div>
  );
}

