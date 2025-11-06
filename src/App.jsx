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

  const [images, setImages] = useState([]);  // TODO: calculate from tagsByImage
  const [selectedImages, setSelectedImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});  // NOTE: Do not use in effect deplist.

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
    console.log('app:useEffect: get all tags');
    if (!pythonApi) return;

    pythonApi.get_all_tags().then(tags => {
      if (tags) {
        setAllTags(tags);
      }
    });
  }, [pythonApi, setAllTags]);

  // get tags
  useEffect(() => {
    console.log('app:useEffect: get_tags_for_images, images=', images);
    if (!pythonApi) return;

    console.log('app:useEffect: get_tags_for_images calling python api');
    pythonApi.get_tags(images).then((val) => {
      console.log('app:useEffect: get_tags_for_images, promise resolved: got tagsByImage:', val);
      setTagsByImage(val);
    });
  }, [images, pythonApi]);

  // get images
  useEffect(() => {
    console.log(`useEffect: get_images include_tags=${includedTags} excludedTags=${excludedTags}`);
    if (!pythonApi) return;

    console.log('app:useEffect: get_images calling python api');
    pythonApi.get_images(includedTags, excludedTags).then((val) => {
      console.log('app:useEffect: get_images promise resolved: got images:', val);
      setImages(val);
    });
  }, [includedTags, excludedTags, pythonApi]);

  // focus input field
  useEffect(() => {
    console.log('app:useEffect: focus input');
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
    console.log(`EDIT MODE:removeTagFromImages tag:${tagText} images:`, selectedImages);
    if (!pythonApi) return;

    const selectedImagePaths = selectedImages.map((image) => {
      return image.src.substring(22);
    });

    pythonApi.remove_tag_from_images(tagText, selectedImagePaths).then((count) => {
      console.log('we removed ', count, ' tags from db, removing from state.');
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImagePaths) {
        const tags = copy[image];
        console.log('tags on', image, ': ', tags);
        tags.splice(tags.indexOf(tagText), 1);
        copy[image] = tags;
      }
      setTagsByImage(copy);
    });
  }

  // callback
  const addTagToImages = (tagText) => {
    console.log(`EDIT MODE:addTagToImages tag:${tagText} images:`, selectedImages);
    if (!pythonApi) return;

    const selectedImagePaths = selectedImages.map((image) => {
      return image.src.substring(22);
    });

    pythonApi.add_tag_to_images(tagText, selectedImagePaths).then((count) => {
      console.log('we added', count, ' imagetags to db, updating state.');
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImagePaths) {
        const tags = copy[image];
        console.log('tags on', image, ': ', tags);
        copy[image] = [...tags, tagText];
      }
      setTagsByImage(copy);
    });
  }

  const createTag = (tagText) => {
    console.log(`EDIT MODE:createTag(${tagText}`);
    if (!pythonApi) return;

    pythonApi.create_tag(tagText).then((count) => {
      console.log('we create', count, 'tags in db, adding to state.');
      if (!count) return;

      setAllTags([...allTags, tagText]);
    });
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
      const realImage = image.src.substring(22);
      console.log('checking for tags on', realImage);
      if (!(realImage in tagsByImage)) {
        console.log('no tags sorry', realImage);
        continue;
      }
      console.log('found tags', tagsByImage[realImage]);
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
      </div>
      <DragSelectProvider settings={{ draggability: false }}>
        <p>&nbsp;&nbsp;Images ({images.length}) { selectedImages.length ? ( `(${selectedImages.length} selected)` ) : null }</p>
        <hr />
        <Gallery
          images={images}
          setSelectedImages={setSelectedImages}
        />
      </DragSelectProvider>
    </>
  );
}
