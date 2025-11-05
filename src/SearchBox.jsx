import React from 'react';
import TextInput from 'react-autocomplete-input';

import TagBox from './TagBox.jsx';

class MyTextInput extends TextInput {
  constructor(props) {
    super(props);
    this.refInput = props.inputref;
  }
}

export default function SearchBox({ tagBoxId, title, allTags, tags, setTags, inputref }) {
  console.log('searchbox render');

  // callback
  const handleForm = (formData) => {
    const input = formData.get('input');
    if (!input) return;
    if (!tags.includes(input)) {
      setTags([
        ...tags,
        input
      ])
    }
  }

  // callback
  const removeTag = (e, tag) => {
    console.log('searchbox: removeTag:', tag);
    const newTags = tags.filter(t => t !== tag);
    console.log('searchbox: setting tags to:', newTags);
    setTags(newTags);
  }

  return (
    <>
      <form id='form-include-tags' action={handleForm}>
        <MyTextInput
          name='input'
          options={allTags}
          trigger=''
          spacer=''
          Component='input'
          passThroughEnter={true}
          placeholder={title}
          inputref={inputref}
        />
        <input type='submit' hidden />
      </form>
      <TagBox 
        id={tagBoxId}
        title={title}
        tags={tags}
        removeTagHandler={removeTag}
      />
    </>
  );
}

