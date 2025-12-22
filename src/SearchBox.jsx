import React from 'react';
import { useState } from 'react';
import Select from 'react-select';

import TagBox from './TagBox.jsx';

export default function SearchBox({ tagBoxId, title, allTags=[], tags, setTags, inputref }) {
  const [value, setValue] = useState(null);

  const handleOnChange = ({ value: tagText, count }) => {
    if (!tagText) return;
    if (!tags.find((tag) => tag.tagText == tagText)) {
      setTags([
        ...tags,
        {tagText, count}
      ])
    }
    setValue(null);
  }

  // callback
  const removeTag = ({ tagText }) => {
    const newTags = tags.filter(t => t.tagText !== tagText);
    setTags(newTags);
  }

  const options = allTags.map((t) => ({ 'value': t.tagText, 'label': `${t.tagText} (${t.count})`, count: t.count }));

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

