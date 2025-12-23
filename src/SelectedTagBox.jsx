import React from 'react';
import { useRef, useState } from 'react';

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
  addTagToImages,
  createTagHandler,
  removeTagHandler,
  removeEditableHandler 
}) {
  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addTagValue, setAddTagValue] = useState(false);
  const addTagRef = useRef(null);

  // callback
  const addTag = ({ value: tagText }) => {
    if (!tagText) {
      console.log('idk why but i didnt get tagtext');
      return;
    }

    addTagToImages({ tagText });
    setAddTagValue('');
    setAdding(false);
  };

  // callback
  const createTag = (tagText) => {
    console.log('first create tag', tagText);
    createTagHandler({ tagText });
    console.log('then add tag', tagText);
    addTag({ value: tagText });
  };

  const handleKeyDown = ({ key }) => {
    if (key == 'Escape') {
      setAdding(false);
      setEditing(false);
    }
  };

  const tagItems = tags.map((tag) =>
    <Tag
      tag={tag}
      addTagHandler={editing ? null : addTagHandler}
      removeTagHandler={editing ? removeEditableHandler : removeTagHandler}
      key={tag.tagText}
      className={editing ? 'deleteme' : ''}
    />
  );

  const options = allTags.map((t) => ({value: t.tagText, label: `${t.tagText} (${t.count})`, count: t.count }));

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
          autoFocus={true}
          isClearable
          onChange={addTag}
          onKeyDown={handleKeyDown}
          onCreateOption={createTag}
          options={options}
          value={addTagValue}
          ref={addTagRef}
        />
      ) : null }
    </div>
    </>
  );
}


// TODO: onCreateOption is not needed if we use getNewOptionData appropriately?
