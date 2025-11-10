import React from 'react';
import { useEffect, useRef, useState } from 'react';

import Gallery from './Gallery.jsx';
import SearchBox from './SearchBox.jsx';
import MySwiper from './Swiper.jsx';
import SelectedTagBox from './SelectedTagBox.jsx';
import TagBox from './TagBox.jsx';

// import { DragSelectProvider } from './DragSelectContext';
import { usePythonApi } from './usePythonApi';

export default function App() {
  const [allTags, setAllTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState([]);
  const [includedTags, setIncludedTags] = useState([]);
  const [index, setIndex] = useState(-1);
  console.log('app render, index is', index);

  const [selectedImages, setSelectedImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});  // NOTE: Do not use in effect deplist.

  const includeInputRef = useRef(null);
  const excludeInputRef = useRef(null);

  // pythonApi
  const pythonApi = usePythonApi();

  const images = Object.keys(tagsByImage);

  /*
  useEffect(() => {
    console.log('app:useEffect: sync index to selectedImages');
    if (index < 0) return;

    setSelectedImages([images[index]]);
  }, [images, index]);
  */

  // Escape key
  useEffect(() => {
    console.log('app:useEffect: add escape handler')

    const handler = ({ key }) => {
      if (key == 'Escape') {
        console.log('escape pressed');
        setIndex(-1);
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    }
  }, []);

  // get all tags
  useEffect(() => {
    console.log('app:useEffect: get all tags');
    if (!pythonApi) return;

    pythonApi.get_all_tags().then(tags => {
      if (tags) {
        setAllTags(tags);
      }
    });
  }, [pythonApi, setAllTags]);

  // get images
  useEffect(() => {
    console.log(`useEffect: get_images include_tags=${includedTags} excludedTags=${excludedTags}`);
    if (!pythonApi) return;

    console.log('app:useEffect: get_images calling python api', includedTags, excludedTags);
    pythonApi.get_images(includedTags, excludedTags).then((images) => {
      console.log('app:useEffect: get_images promise resolved: got images:', images);
      pythonApi.get_tags(images).then((newtagsbyimage) => {
        console.log('app:useEffect: get_tags_for_images, promise resolved: got tagsByImage:', 
          newtagsbyimage);
        setTagsByImage(newtagsbyimage);
      });
    });
  }, [includedTags, excludedTags, pythonApi]);

  // focus input field
  useEffect(() => {
    console.log('app:useEffect: focus input');
    const element = includeInputRef.current;
    if (!element) return;
    element.focus();
  }, []);

  // callback
  const addIncludedTag = ({ tagText }) => {
    if (!includedTags.includes(tagText)) {
      setIncludedTags([
        ...includedTags,
        tagText
      ])
    }
  };

  // callback
  const addExcludedTag = ({ tagText }) => {
    if (!excludedTags.includes(tagText)) {
      setExcludedTags([
        ...excludedTags,
        tagText
      ])
    }
  };

  // callback
  const removeTagFromImages = ({ tagText }) => {
    console.log(`EDIT MODE:removeTagFromImages tag:${tagText} images:`, selectedImages);
    if (!pythonApi) return;

    pythonApi.remove_tag_from_images(tagText, selectedImages).then((count) => {
      console.log('we removed ', count, ' tags from db, removing from state.');
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImages) {
        const tags = copy[image];
        console.log('tags on', image, ': ', tags);
        tags.splice(tags.indexOf(tagText), 1);
        copy[image] = tags;
      }
      setTagsByImage(copy);
    });
  }

  // callback
  const addTagToImages = ({ tagText }) => {
    console.log(`EDIT MODE:addTagToImages tag:${tagText} images:`, selectedImages);
    if (!pythonApi) return;

    pythonApi.add_tag_to_images(tagText, selectedImages).then((count) => {
      console.log('we added', count, ' imagetags to db, updating state.');
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImages) {
        const tags = copy[image];
        console.log('tags on', image, ': ', tags);
        copy[image] = [...tags, tagText];
      }
      setTagsByImage(copy);
    });
  }

  // callback
  const createTag = ({ tagText }) => {
    console.log(`EDIT MODE:createTag(${tagText}`);
    if (!pythonApi) return;

    pythonApi.create_tag(tagText).then((count) => {
      console.log('we create', count, 'tags in db, adding to state.');
      if (!count) return;

      setAllTags([...allTags, tagText]);
    });
  }

  // callback
  const setIndexAndSelected = (index_) => {
    console.log('combine callback');
    setIndex(index_);
    setSelectedImages([images[index_]]);
  }

  const visibleTags = new Set();
  let imgCount = 0;
  for (const v of Object.values(tagsByImage)) {
    imgCount += 1;
    for (const tag of v) {
      visibleTags.add(tag);
    }
  }
  console.log(`app.render: there are ${visibleTags.size} tags visible on ${imgCount} images`);


  const selectedTags = [];
  if (selectedImages && tagsByImage) {
    for (const image of selectedImages) {
      console.log('checking for tags on', image);
      if (!(image in tagsByImage)) {
        console.log('no tags sorry', image);
        continue;
      }
      console.log('found tags', tagsByImage[image]);
      for (const tag of tagsByImage[image]) {
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
              allTags={allTags}
              changeHandler={addTagToImages}
              createTag={createTag}
              addTagHandler={addIncludedTag}
              removeTagHandler={addExcludedTag}
              removeEditableHandler={removeTagFromImages}
            />
          </div>
          <div className='tagbox'>
            <TagBox
              id='all-tags'
              title='Tags on these images'
              tags={[...visibleTags]}
              addTagHandler={addIncludedTag}
              removeTagHandler={addExcludedTag}
            />
          </div>
          { images.length ? null : (
          <div className='tagbox'>
            <TagBox
              id='all-tags'
              title='All tags'
              tags={allTags}
              addTagHandler={addIncludedTag}
              removeTagHandler={addExcludedTag}
            />
          </div>
          )}
      </div>
      { index >= 0 ?
        <MySwiper 
          images={images}
          initialSlide={index}
          setIndex={setIndexAndSelected}
        /> : (
        <Gallery
          images={images}
          selectedCount={selectedImages.length}
          setIndex={setIndex}
          setSelectedImages={setSelectedImages}
        />
        )}
    </>
  );
}

//      <DragSelectProvider settings={{ draggability: false }}>
//      </DragSelectProvider>
/*
      { index >= 0 ?
        <MySwiper 
          images={images}
        /> : (
        */
