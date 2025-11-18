import React from 'react';

import Tag from './Tag.jsx';


export default function TagBox({ id, title, tags = [], addTagHandler, removeTagHandler }) {
  console.log('TagBox<> render');
  const tagItems = tags.map((tag, index) =>
    <Tag
      tag={tag}
      addTagHandler={addTagHandler}
      removeTagHandler={removeTagHandler}
      key={`${tag.tagText}-${index}`}
    />
  );

  return (
    <>
    { tagItems.length ? ( <p> {title} ({tagItems.length}) </p>) : null }
    <div id={id} className='tags'>
      {tagItems}
    </div>
    </>
  );
}
