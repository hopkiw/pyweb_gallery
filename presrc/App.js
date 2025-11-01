import React from 'react';
import { useEffect, useRef, useState } from 'react';
import TextInput from 'react-autocomplete-input';

import Gallery from './Gallery.js';
import TagBox from './TagBox.js';

import { DragSelectProvider } from './DragSelectContext';

class MyTextInput extends TextInput {
  constructor(props) {
    super(props);
    this.refInput = props.inputref;
  }
}

async function getAllTags() {
  const url = '/getTags';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const res = await response.json();
    return res;
  } catch (error) {
    console.error(error.message);
  }
}

export default function App() {
  const [includedTags, setIncludedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);  // TODO: calculate from tagsByImage
  const [tagsByImage, setTagsByImage] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [allTags, setAllTags] = useState([]);

  const includeInputRef = useRef(null);
  const excludeInputRef = useRef(null);

  useEffect(() => {
    if (!(allTags.length)) {
      const promise = getAllTags();
      promise.then( val =>  setAllTags(val) );
    }
  }, [allTags]);

  function handleIncludeForm(e) {
    e.preventDefault();

    const field = includeInputRef.current;
    if (!field || !field.value) return;
    if (!includedTags.includes(field.value)) {
      setIncludedTags([
        ...includedTags,
        field.value
      ])
    }
    field.value = '';
  }

  function handleExcludeForm(e) {
    e.preventDefault();

    const field = excludeInputRef.current;
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

  function addIncludedTag(e, tagText) {
    if (!includedTags.includes(tagText)) {
      setIncludedTags([
        ...includedTags,
        tagText
      ])
    }
  }

  function addExcludedTag(e, tagText) {
    if (!excludedTags.includes(tagText)) {
      setExcludedTags([
        ...excludedTags,
        tagText
      ])
    }
  }

  function removeIncludedTag(e, tagText) {
    var copy = [...includedTags];
    copy.splice(includedTags.indexOf(tagText), 1);
    setIncludedTags(copy);
  }

  function removeExcludedTag(e, tagText) {
    var copy = [...excludedTags];
    copy.splice(excludedTags.indexOf(tagText), 1);
    setExcludedTags(copy);
  }

  const selectedTags = [];
  if (selectedImages && tagsByImage) {
    for (const image of selectedImages) {
      const realImage = image.src.substring(22);
      if (!(realImage in tagsByImage)) {
        continue;
      }
      for (const tag of tagsByImage[realImage]) {
        if (!selectedTags.includes(tag)) {
          selectedTags.push(tag);
        }
      }
    }
  }

  useEffect(() => {
    const element = includeInputRef.current;
    if (!element) return;
    element.focus()
  }, [includeInputRef]);

  return (
    <>
      <div className='w3-sidebar w3-bar-block searchbar'>
        <form id='form-include-tags'>
          <MyTextInput
            options={allTags}
            trigger=''
            spacer=''
            Component='input'
            passThroughEnter={true}
            inputref={includeInputRef}
          />
          <input type='submit' onClick={handleIncludeForm} hidden />
        </form>
        <TagBox 
          title='Tags to include:'
          tags={includedTags}
          removeTagHandler={removeIncludedTag}
        />
        <form id='form-exclude-tags'>
          <MyTextInput
            options={allTags}
            trigger=''
            spacer=''
            Component='input'
            passThroughEnter={true}
            inputref={excludeInputRef}
          />
          <input type='submit' onClick={handleExcludeForm} hidden />
        </form>
        <TagBox 
          title='Tags to exclude:'
          tags={excludedTags}
          removeTagHandler={removeExcludedTag}
        />
        <TagBox
          title='Tags on selected:'
          tags={selectedTags}
          addTagHandler={addIncludedTag}
          removeTagHandler={addExcludedTag}
        />
        <TagBox
          title='All tags:'
          tags={visibleTags}
          addTagHandler={addIncludedTag}
          removeTagHandler={addExcludedTag}
        />
      </div>
      <DragSelectProvider settings={{ draggability: false }}>
        <Gallery
          tags={includedTags}
          excludedTags={excludedTags}
          setVisibleTags={updateImageTags}
          setSelectedImages={setSelectedImages}
        />
      </DragSelectProvider>
    </>
  );
}
