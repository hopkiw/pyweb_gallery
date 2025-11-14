import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

import TagBox from './TagBox.jsx';

export default function SearchBox({ tagBoxId, title, allTags, tags, setTags, inputref }) {
  console.log('searchbox render, tags are:', tags, ' and alltags are:', allTags);
  const [value, setValue] = useState(null);

  const handleOnChange = ({ value: tagText, count }) => {
    console.log('searchbox: callback: get new tag:', tagText);
    if (!tagText) return;
    if (!tags.find((tag) => tag.tagText == tagText)) {
      console.log('searchbox: ADD new tag:', tagText);
      setTags([
        ...tags,
        {tagText, count}
      ])
    }
    setValue(null);
  }

  // callback
  const removeTag = ({ tagText }) => {
    console.log('searchbox: removeTag callback:', tagText);
    const newTags = tags.filter(t => t.tagText !== tagText);
    console.log('searchbox: setting tags to:', newTags);
    setTags(newTags);
  }

  const options = allTags.map((t) => ({ 'value': t.tagText, 'label': `${t.tagText} (${t.count})`, count: t.count }));
  console.log('searchbox: generated options:', options);

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

