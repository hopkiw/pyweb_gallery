import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

import TagBox from './TagBox.jsx';

export default function SearchBox({ tagBoxId, title, allTags, tags, setTags, inputref }) {
  console.log('searchbox render');
  const [value, setValue] = useState(null);

  const handleOnChange = ({ value: newTag }) => {
    console.log('searchbox: get new tag:', newTag);
    if (!newTag) return;
    if (!tags.includes(newTag)) {
      console.log('searchbox: ADD new tag:', newTag);
      setTags([
        ...tags,
        newTag
      ])
    }
    setValue(null);
  }

  // callback
  const removeTag = ({ tagText }) => {
    console.log('searchbox: removeTag:', tagText);
    const newTags = tags.filter(t => t !== tagText);
    console.log('searchbox: setting tags to:', newTags);
    setTags(newTags);
  }

  const options = allTags.map((t) => ({'value': t, 'label': t }));

  console.log('searchbox.render options:', options);

  return (
    <>
      <Select
        options={options}
        ref={inputref}
        onChange={handleOnChange}
        value={value}
      />
      <TagBox 
        id={tagBoxId}
        title={title}
        tags={tags}
        removeTagHandler={removeTag}
      />
    </>
  );
}

