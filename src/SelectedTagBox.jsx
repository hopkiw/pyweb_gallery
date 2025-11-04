import React from 'react';
import { useState } from 'react';

import Tag from './Tag.jsx';
import SvgIconEdit from './SvgIconEdit.jsx';
import SvgIconEditOutline from './SvgIconEditOutline.jsx';


export default function SelectedTagBox({ id, title, tags = [], addTagHandler, removeTagHandler, removeEditableHandler }) {
  const [editing, setEditing] = useState(false);

  const tagItems = tags.map((tag) =>
    <Tag
      tag={tag}
      addTagHandler={editing ? null : addTagHandler}
      removeTagHandler={editing ? removeEditableHandler : removeTagHandler}
      key={tag}
      className={editing ? 'deleteme' : ''}
    />
  );

  const header = (
    <>
      <p>
        {title} ({tagItems.length})
        <a onClick={() => setEditing(!editing)}>
          { editing ? <SvgIconEdit /> : <SvgIconEditOutline /> }
        </a>
      </p>
    </>
  );

  return (
    <>
    { tagItems.length ? (header) : null }
    <div id={id} className='tags'>
      {tagItems}
    </div>
    </>
  );
}

