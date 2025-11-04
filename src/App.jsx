import React from 'react';
import { useEffect, useRef, useState } from 'react';

import Gallery from './Gallery.jsx';
import SearchBox from './SearchBox.jsx';
import SelectedTagBox from './SelectedTagBox.jsx';
import TagBox from './TagBox.jsx';

import { DragSelectProvider } from './DragSelectContext';

export default function App() {
  console.log('app render');
  const [allTags, setAllTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [includedTags, setIncludedTags] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});
  const [pythonApi, setPythonApi] = useState(undefined); // TODO: extract

  const includeInputRef = useRef(null);
  const excludeInputRef = useRef(null);

  // pythonApi
  useEffect(() => {
    const handler = () => { setPythonApi(window.pywebview.api) };
    window.addEventListener('pywebviewready', handler);

    return () => {
      window.removeEventListener('pywebviewready', handler);
    }
  }, [setPythonApi]);

  // get all tags
  useEffect(() => {
    if (!pythonApi) return;

    pythonApi.get_all_tags().then(tags => {
      if (tags) {
        setAllTags(tags);
      }
    });
  }, [pythonApi, setAllTags]);

  // focus input field
  useEffect(() => {
    const element = includeInputRef.current;
    if (!element) return;
    element.focus();
  }, []);

  // TODO: use object explode instead of 2 params
  // callback
  const addIncludedTag = (e, tagText) => {
    if (!includedTags.includes(tagText)) {
      setIncludedTags([
        ...includedTags,
        tagText
      ])
    }
  };

  // callback
  const addExcludedTag = (e, tagText) => {
    if (!excludedTags.includes(tagText)) {
      setExcludedTags([
        ...excludedTags,
        tagText
      ])
    }
  };

  // callback
  const removeTagFromImages = (e, tagText) => {
    console.log(`removeTagFromImages tag:${tagText} images:`, selectedTags);
    
  }

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
        <div className='tagbox'>
          <SearchBox
            tagBoxId='include-tags'
            title='Tags to include'
            allTags={allTags}
            tags={includedTags}
            setTags={setIncludedTags}
            inputref={includeInputRef}
          />
        </div>
        <div className='tagbox'>
          <SearchBox
            tagBoxId='exclude-tags'
            title='Tags to exclude'
            allTags={allTags}
            tags={excludedTags}
            setTags={setExcludedTags}
            inputref={excludeInputRef}
          />
        </div>
          <div className='tagbox'>
            <SelectedTagBox
              id='selected-tags'
              title='Tags on selected'
              tags={selectedTags}
              addTagHandler={addIncludedTag}
              removeTagHandler={addExcludedTag}
              removeEditableHandler={removeTagFromImages}
            />
          </div>
          <div className='tagbox'>
            <TagBox
              id='all-tags'
              title='All tags'
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
          setTagsByImage={setTagsByImage}
          setSelectedImages={setSelectedImages}
        />
      </DragSelectProvider>
    </>
  );
}
