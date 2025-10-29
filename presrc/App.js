import React from 'react';
import { useState } from 'react';

import Gallery from './Gallery.js';
import IncludedTags from './IncludedTags.js';

export default function App() {
  const [images, setImages] = useState([]);
  const [includedTags, setIncludedTags] = useState([]);

  function handleForm(e) {
    e.preventDefault();

    const field = document.getElementById('form-include-tags-field');
    if (field.value) {
      if (!includedTags.includes(field.value)) {
        setIncludedTags([
          ...includedTags,
          field.value
        ])
      }
      field.value = '';
    }
  }

  function removeIncludedTag(e) {
    var tagText = e.target.nextSibling.text;
    console.log('remove tag with text', tagText);

    var copy = [...includedTags];
    copy.splice(includedTags.indexOf(tagText, 1));
    setIncludedTags(copy);
  }

  return (
    <>
      <div className="w3-sidebar w3-bar-block searchbar">
        <form id='form-include-tags'>
          <label> Tags to include:
            <input type="text" id='form-include-tags-field' name="include-tags" />
          </label>
          <input type="submit" onClick={handleForm} />
        </form>
        <IncludedTags 
          tags={includedTags}
          removeTagHandler={removeIncludedTag}
        />
        <div id="include-tags"></div>
        <form>
          <label> Tags to exclude:
            <input type="text" name="exclude-tags" />
          </label>
          <input type="submit" />
        </form>
        <div id="exclude-tags"></div>
        <div id="all-tags"></div>
      </div>
      <Gallery
        tags={includedTags}
      />
    </>
  );
}
