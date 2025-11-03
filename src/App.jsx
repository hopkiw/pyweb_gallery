import React from 'react';
import { useEffect, useState } from 'react';

import Gallery from './Gallery.jsx';
import SearchBox from './SearchBox.jsx';
import TagBox from './TagBox.jsx';

import { DragSelectProvider } from './DragSelectContext';
import { callPython } from './pythonBridge.js';


async function getAllTags() {
  return callPython('get_all_tags');
}

export default function App() {
  const [allTags, setAllTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [includedTags, setIncludedTags] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});

  useEffect(() => {
    console.log('bruv');
    getAllTags().then(tags => {
      console.log('finally:', tags);
      setAllTags(tags);
    });
  }, []);

  const addIncludedTag = (e, tagText) => {
    if (!includedTags.includes(tagText)) {
      setIncludedTags([
        ...includedTags,
        tagText
      ])
    }
  };

  const addExcludedTag = (e, tagText) => {
    if (!excludedTags.includes(tagText)) {
      setExcludedTags([
        ...excludedTags,
        tagText
      ])
    }
  };

  const visibleTags = new Set();
  for (const v of Object.values(tagsByImage)) {
    for (const tag of v) {
      visibleTags.add(tag);
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
            tags={[...visibleTags]}
            addTagHandler={addIncludedTag}
            removeTagHandler={addExcludedTag}
          />
        </div>
      </div>
      <DragSelectProvider settings={{ draggability: false }}>
        <Gallery
          tags={includedTags}
          excludedTags={excludedTags}
          setVisibleTags={setTagsByImage}
          setSelectedImages={setSelectedImages}
        />
      </DragSelectProvider>
    </>
  );
}
