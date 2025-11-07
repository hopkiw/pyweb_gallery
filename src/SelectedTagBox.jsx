import React from 'react';
import { useState } from 'react';

import CreatableSelect from 'react-select/creatable';

import Tag from './Tag.jsx';
import SvgIconEdit from './icons/SvgIconEdit.jsx';
import SvgIconEditOutline from './icons/SvgIconEditOutline.jsx';
import SvgIconPencilAdd from './icons/SvgIconPencilAdd.jsx';


export default function SelectedTagBox({ 
  id,
  title,
  tags = [],
  allTags,
  addTagHandler,
  changeHandler,
  createTag,
  removeTagHandler,
  removeEditableHandler 
}) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addTagValue, setAddTagValue] = useState(false);

  // callback
  const handleChange = ({ value: tagText }) => {
    if (!tagText) return;

    console.log('SelectedTagBox.handleChange:', tagText);
    changeHandler({ tagText });
    setAddTagValue('');
  };

  const tagItems = tags.map((tag) =>
    <Tag
      tag={tag}
      addTagHandler={editing ? null : addTagHandler}
      removeTagHandler={editing ? removeEditableHandler : removeTagHandler}
      key={tag}
      className={editing ? 'deleteme' : ''}
    />
  );

  return (
    <>
    { tagItems.length? (
    <p>
      {title} ({tagItems.length})
      <a onClick={() => setEditing(!editing)}>
        { editing ? <SvgIconEdit /> : <SvgIconEditOutline /> }
      </a>
      <a onClick={() => setAdding(!adding)}>
        <SvgIconPencilAdd />
      </a>
    </p> 
    ) : null }
    <div id={id} className='tags'>
      {tagItems}
      { adding ? (
        <CreatableSelect
          isClearable
          onChange={handleChange}
          onCreateOption={(tagText) => createTag({ tagText })}
          options={allTags.map(t => ({ label: t, value: t }))}
          value={addTagValue}
        />
      ) : null }
    </div>
    </>
  );
}

