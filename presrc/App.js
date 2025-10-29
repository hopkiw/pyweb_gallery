import React from 'react';
import { useState } from 'react';

import Gallery from './Gallery.js';
import IncludedTags from './IncludedTags.js';
import VisibleTags from './VisibleTags.js';

export default function App() {
  const [includedTags, setIncludedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);  // TODO: calculate from tagsByImage
  const [tagsByImage, setTagsByImage] = useState({});

  function handleIncludeForm(e) {
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

  function handleExcludeForm(e) {
    e.preventDefault();

    const field = document.getElementById('form-exclude-tags-field');
    if (field.value) {
      if (!excludedTags.includes(field.value)) {
        setExcludedTags([
          ...excludedTags,
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

    if (!includedTags.includes(tagText)) {
      setIncludedTags([
        ...includedTags,
        tagText
      ])
    }
  }

  function addExcludedTag(e) {
    var tagText = e.target.nextSibling.text;

    if (!excludedTags.includes(tagText)) {
      setExcludedTags([
        ...excludedTags,
        tagText
      ])
    }
  }

  function removeIncludedTag(e) {
    var tagText = e.target.nextSibling.text;

    var copy = [...includedTags];
    copy.splice(includedTags.indexOf(tagText), 1);
    setIncludedTags(copy);
  }

  function removeExcludedTag(e) {
    var tagText = e.target.nextSibling.text;

    var copy = [...excludedTags];
    copy.splice(excludedTags.indexOf(tagText), 1);
    setExcludedTags(copy);
  }

  return (
    <>
      <div className="w3-sidebar w3-bar-block searchbar">
        <form id='form-include-tags'>
          <label> Tags to include:
            <input type="text" id='form-include-tags-field' name="include-tags" />
          </label>
          <input type="submit" onClick={handleIncludeForm} />
        </form>
        <IncludedTags 
          tags={includedTags}
          removeTagHandler={removeIncludedTag}
        />
        <form id='form-exclude-tags'>
          <label> Tags to exclude:
            <input type="text" id='form-exclude-tags-field' name="exclude-tags" />
          </label>
          <input type="submit" onClick={handleExcludeForm} />
        </form>
        <IncludedTags 
          tags={excludedTags}
          removeTagHandler={removeExcludedTag}
        />
        <VisibleTags
          tags={visibleTags}
          addTagHandler={addIncludedTag}
          removeTagHandler={addExcludedTag}
        />
      </div>
      <Gallery
        tags={includedTags}
        excludedTags={excludedTags}
        setVisibleTags={updateImageTags}
      />
    </>
  );
}
