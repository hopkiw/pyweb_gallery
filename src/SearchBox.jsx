import React from 'react';
import TextInput from 'react-autocomplete-input';

import TagBox from './TagBox.jsx';

export default function SearchBox({ tagBoxId, allTags, tags, setTags }) {
  // const includeInputRef = useRef(null);

  function handleForm(formData) {
    const input = formData.get('input');
    if (!input) return;
    if (!tags.includes(input)) {
      setTags([
        ...tags,
        input
      ])
    }
  }

  function removeTag(e, tag) {
    var copy = [...tags];
    copy.splice(tags.indexOf(tag), 1);
    setTags(copy);
  }

  return (
    <div className='tagbox'>
      <form id='form-include-tags' action={handleForm}>
        <TextInput
          name='input'
          options={allTags}
          trigger=''
          spacer=''
          Component='input'
          passThroughEnter={false}
          placeholder='Tags to include'
        />
        <input type='submit' hidden />
      </form>
      <TagBox 
        id={tagBoxId}
        title='Tags to include:'
        tags={tags}
        removeTagHandler={removeTag}
      />
    </div>
  );
}

