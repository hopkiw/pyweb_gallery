import React from 'react';
import { useEffect, useRef, useState } from 'react';

import { usePythonApi } from './usePythonApi.js';

import Gallery from './Gallery.jsx';
import Swiper from './Swiper.jsx';
import SearchBox from './SearchBox.jsx';
import SelectedTagBox from './SelectedTagBox.jsx';
import TagBox from './TagBox.jsx';

export default function GalleryPane({ allTags, createTag, scrollPos, setScrollPos }) {
  const [includedTags, setIncludedTags] = useState(() => {
    const saved = localStorage.getItem('included_tags');
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [excludedTags, setExcludedTags] = useState(() => {
    const saved = localStorage.getItem('excluded_tags');
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });

  const [index, setIndex] = useState(-1);
  const [selectedImages, setSelectedImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});  // NOTE: Do not use in effect deplist.

  const includeInputRef = useRef(null);
  const excludeInputRef = useRef(null);

  const pythonApi = usePythonApi();

  // sync to storage
  useEffect(() => {
    localStorage.setItem('excluded_tags', JSON.stringify(excludedTags));
  }, [excludedTags]);

  // sync to storage
  useEffect(() => {
    localStorage.setItem('included_tags', JSON.stringify(includedTags));
  }, [includedTags]);

  // Escape key
  useEffect(() => {
    const handler = ({ key }) => {
      if (key == 'Escape') {
        setIndex(-1);
        setSelectedImages([]);
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    }
  }, []);

  // get images
  useEffect(() => {
    if (!pythonApi) return;

    // const images = Object.keys(tagsByImage);
    const includedTagTexts = includedTags.map((t) => t.tagText);
    const excludedTagTexts = excludedTags.map((t) => t.tagText);

    pythonApi.get_images(includedTagTexts, excludedTagTexts).then((images) => {
      pythonApi.get_tags(images).then((newtagsbyimage) => {
        setTagsByImage(newtagsbyimage);
      });
    });
  }, [includedTags, excludedTags, pythonApi]);

  // focus input field
  useEffect(() => {
    const element = includeInputRef.current;
    if (!element) return;
    element.focus();
  }, []);

  // reset scroll
  useEffect(() => {
    if (index == -1) {
      setTimeout(() => window.scrollTo(0, scrollPos), 0);
    }
  }, [index, scrollPos]);

  // callback
  const setIndexAndSelected = (index_) => {
    // TODO: aren't effects supposed to handle this 'if changed' logic
    if (index_ >= 0 && index_ != index) {
      setIndex(index_);
      setSelectedImages([images[index_]]);
    } 
  }

  // callback
  const addIncludedTag = ({ tagText }) => {
    if (!includedTags.find((tag) => tag.tagText == tagText)) {
      const ttag = allTags.find((tag) => tag.tagText == tagText)
      if (!ttag) {
        return;
      }
      const count = ttag.count;
      setIncludedTags([
        ...includedTags,
        { tagText, count }
      ])
    }
  };

  // callback
  const addExcludedTag = ({ tagText }) => {
    if (!excludedTags.find((tag) => tag.tagText == tagText)) {
      const count = allTags.find((tag) => tag.tagText == tagText).count;
      setExcludedTags([
        ...excludedTags,
        { tagText, count }
      ])
    }
  };

  // callback
  const removeTagFromImages = ({ tagText }) => {
    if (!pythonApi) return;

    pythonApi.remove_tag_from_images(tagText, selectedImages).then((count) => {
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImages) {
        const tags = copy[image];
        tags.splice(tags.indexOf(tagText), 1);
        copy[image] = tags;
      }
      setTagsByImage(copy);
    });
  }

  // callback
  const addTagToImages = ({ tagText }) => {
    if (!pythonApi) return;

    pythonApi.add_tag_to_images(tagText, selectedImages).then((count) => {
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImages) {
        const tags = copy[image];
        copy[image] = [...tags, tagText];
      }
      setTagsByImage(copy);
    });
  }

  const visibleTags = [];
  for (const v of Object.values(tagsByImage)) {
    for (const tagText of v) {
      if (!visibleTags.find((tag) => tag.tagText == tagText)) {
        const found = allTags.find((tag) => tag.tagText == tagText);
        if (!found) {
          console.log('couldnt find tag in alltags:', tagText);
          return;
        }
        visibleTags.push({ tagText, count: found.count });
      }
    }
  }
  visibleTags.sort((a, b) => b.count - a.count);

  const selectedTags = [];
  if (selectedImages && tagsByImage) {
    for (const image of selectedImages) {
      if (!(image in tagsByImage)) {
        continue;
      }
      for (const tagText of tagsByImage[image]) {
        if (!selectedTags.find((tag) => tag.tagText == tagText)) {
          const count = allTags.find((tag) => tag.tagText == tagText).count;
          selectedTags.push({tagText, count});
        }
      }
    }
  }
  selectedTags.sort((a, b) => b.count - a.count);

  const images = Object.keys(tagsByImage);

  return (
    <div>
      <div className='searchbar'>
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

      <div>
        { index >= 0 ? (
          <Swiper 
            images={images}
            initialSlide={index}
            setIndex={setIndexAndSelected}
            hidden={index >= 0}
          />
        ) : (

        <Gallery
          images={images}
          selectedImages={selectedImages}
          setIndex={setIndexAndSelected}
          setSelectedImages={setSelectedImages}
          setScrollPos={setScrollPos}
        />
        )}
      </div>
      </div>
  );
}

