import React from 'react';
import { useEffect, useEffectEvent, useRef, useState } from 'react';

import CreatableSelect from 'react-select/creatable';

import Tag from './Tag.jsx';
import SvgIconEdit from './icons/SvgIconEdit.jsx';
import SvgIconEditOutline from './icons/SvgIconEditOutline.jsx';
import SvgIconPencilAdd from './icons/SvgIconPencilAdd.jsx';

import { useKeyListener } from './useKeyListener.js';


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
  const addTagRef = useRef(null);

  // const keyStore = useKeyListener();
  const keyStore = useRef({ control: false, shift: false });

  useEffect(() => {
    const handleKeyDown = ({ key }) => {
      if (key === 'Control' && keyStore.current.control !== true) {
        keyStore.current.control = true;
      }
      if (key === 'Shift' && keyStore.current.shift !== true) {
        keyStore.current.shift = true;
      }
      if (key == 't' && keyStore.current.control && tags.length) {
        console.log('control-t');
        setAdding(true);
      }
    }

    const handleKeyUp = (e) => {
      if (e.key === 'Control' && keyStore.current.control !== false) {
        keyStore.current.control = false;
      }
      if (e.key === 'Shift' && keyStore.current.shift !== false) {
        keyStore.current.shift = false;
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    }
  }, []);

  useEffect(() => {
    const handleOnLoad = () => {
      if (adding) {
        const el = addTagRef.current;
        if (el) el.focus();
      }
    };

    window.addEventListener('onload', handleOnLoad);
    return () => {
      window.removeEventListener('onload', handleOnLoad);
    }
  }, [adding]);

  // callback
  const handleChange = ({ value: tagText }) => {
    if (!tagText) return;

    // console.log('SelectedTagBox.handleChange:', tagText);
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
          ref={addTagRef}
        />
      ) : null }
    </div>
    </>
  );
}

