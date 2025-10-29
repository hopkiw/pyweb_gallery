import React from 'react';
import { useState } from 'react';

import Gallery from './Gallery.js';
import IncludedTags from './IncludedTags.js';
import VisibleTags from './VisibleTags.js';

export default function App() {
  const [includedTags, setIncludedTags] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});

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

  function updateImageTags(tags) {
    const allTags = new Set();
    for (const [k, v] of Object.entries(tags)) {
      for (const tag of v) {
        allTags.add(tag);
      }
    }
    setVisibleTags([...allTags]);
    setTagsByImage(tags);
  }

  function addIncludedTag(e) {
    var tagText = e.target.nextSibling.text;

    setIncludedTags([
      ...includedTags,
      tagText
    ])
  }

  function removeIncludedTag(e) {
    var tagText = e.target.nextSibling.text;

    var copy = [...includedTags];
    copy.splice(includedTags.indexOf(tagText), 1);
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
        <form>
          <label> Tags to exclude:
            <input type="text" name="exclude-tags" />
          </label>
          <input type="submit" />
        </form>
        <VisibleTags
          tags={visibleTags}
          addTagHandler={addIncludedTag}
        />
      </div>
      <Gallery
        tags={includedTags}
        setVisibleTags={updateImageTags}
      />
    </>
  );
}


