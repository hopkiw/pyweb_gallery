import React from 'react';

import Tag from './Tag.jsx';

export default function TagBox({ id, title, tags, addTagHandler, removeTagHandler }) {
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
    <div id={id} className='tags'>
      {tagItems}
    </div>
    </>
  );
}

