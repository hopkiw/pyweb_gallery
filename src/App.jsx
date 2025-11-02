import React from 'react';
import { useEffect, useState } from 'react';
import TextInput from 'react-autocomplete-input';

import Gallery from './Gallery.jsx';
import SearchBox from './SearchBox.jsx';
import TagBox from './TagBox.jsx';

import { DragSelectProvider } from './DragSelectContext';
//import { callPython } from './pythonBridge.js';

class MyTextInput extends TextInput {
  constructor(props) {
    super(props);
    this.refInput = props.inputref;
  }
}

/*
async function getAllTags() {
  const url = 'http://localhost:8080/getTags';
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
*/

async function getAllTags() {
  const myprommy = new Promise((resolve, reject) => {
    resolve( ['tag1', 'tag2', 'another tag'] );
  });
  return myprommy;
    
  // const res = await callPython('get_tags', []);
  // return res || [];
}

export default function App() {
  const [includedTags, setIncludedTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [visibleTags, setVisibleTags] = useState([]);  // TODO: calculate from tagsByImage
  const [tagsByImage, setTagsByImage] = useState({});
  const [selectedImages, setSelectedImages] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    if (!(allTags) || !(allTags.length)) {
      const promise = getAllTags();
      promise.then( val =>  setAllTags(val) );
    }
  }, [allTags]);

  function updateImageTags(tags) {
    const allTags = new Set();
    for (const v of Object.values(tags)) {
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

  return (
    <>
      <div className='w3-sidebar w3-bar-block searchbar'>
        <SearchBox
          tagBoxId='include-tags'
          allTags={allTags}
          tags={includedTags}
          setTags={setIncludedTags}
        />
        <SearchBox
          tagBoxId='exclude-tags'
          allTags={allTags}
          tags={excludedTags}
          setTags={setExcludedTags}
        />
        <div className='tagbox'>
          <TagBox
            id='selected-tags'
            title='Tags on selected:'
            tags={selectedTags}
            addTagHandler={addIncludedTag}
            removeTagHandler={addExcludedTag}
          />
        </div>
        <div className='tagbox'>
          <TagBox
            id='all-tags'
            title='All tags:'
            tags={visibleTags}
            addTagHandler={addIncludedTag}
            removeTagHandler={addExcludedTag}
          />
        </div>
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
