import React from 'react';
import { useState } from 'react';

import Tag from './Tag.js';

export default function TagBox({ title, tags, addTagHandler, removeTagHandler }) {
  const tagItems = tags.map((tag) =>
    <Tag
      tag={tag}
      addTagHandler={addTagHandler}
      removeTagHandler={removeTagHandler}
      key={tag}
    />
  );
  return (
    <>
    { tagItems.length ? (<p>{title}</p>) : null }
    <div id='include-tags' className='tags'>
      {tagItems}
    </div>
    </>
  );
}

