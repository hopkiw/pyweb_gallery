import React from 'react';
import { useEffect, useRef, useState } from 'react';

import EditablePage from './EditablePage.jsx';
import EditableTagForm from './EditableTagForm.jsx';
import Gallery from './Gallery.jsx';
import Swiper from './Swiper.jsx';
import SearchBox from './SearchBox.jsx';
import SelectedTagBox from './SelectedTagBox.jsx';
import TagBox from './TagBox.jsx';

import { KeyStoreProvider } from './KeyStoreProvider.jsx';
import { usePythonApi } from './usePythonApi.js';


function FilterField({ setTagFilter }) {
  const ref = useRef(undefined);

  return (
    <input type='search' onChange={() => {
      setTagFilter(ref.current.value);
    }} ref={ref} className='filterfield' />
  );
}

export default function App() {
  const [scrollPos, setScrollPos] = useState(0);
  const [allTags, setAllTags] = useState([]);
  const [excludedTags, setExcludedTags] = useState(() => {
    const saved = localStorage.getItem('excluded_tags');
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [includedTags, setIncludedTags] = useState(() => {
    const saved = localStorage.getItem('included_tags');
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });
  const [index, setIndex] = useState(-1);
  const [tagPaneVisible, setTagPaneVisible] = useState(false);

  const [selectedImages, setSelectedImages] = useState([]);
  const [tagsByImage, setTagsByImage] = useState({});  // NOTE: Do not use in effect deplist.
  const [sortByTag, setSortByTag] = useState(false);
  const [tagFilter, setTagFilter] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  console.log('app render, index is', index, 'there are ', selectedImages.length, ' images selected:', 
    selectedImages);

  const includeInputRef = useRef(null);
  const excludeInputRef = useRef(null);

  // pythonApi
  const pythonApi = usePythonApi();

  const images = Object.keys(tagsByImage);

  // TODO: consistent style in effects & handlers
  // TODO: audit for unnecessary state , when setState((prevstate) => prevstate + 1) could be used
  // TODO: always refresh state from DB
  // TODO: tag pane: clicking a tag turns it into an edit field
  // TODO: tag pane: limit tags shown at a time ?
  // TODO: tag pane: live updating search for tags
  // TODO: tag pane: tag categories

  // sync to storage
  useEffect(() => {
    console.log('sync with local storage');

    localStorage.setItem('excluded_tags', JSON.stringify(excludedTags));
  }, [excludedTags]);

  // sync to storage
  useEffect(() => {
    console.log('sync with local storage');

    localStorage.setItem('included_tags', JSON.stringify(includedTags));
  }, [includedTags]);

  // Escape key
  useEffect(() => {
    console.log('app:useEffect: add escape handler')

    const handler = ({ key }) => {
      if (key == 'Escape') {
        console.log('app:handler: escape pressed');
        setIndex(-1);
        setSelectedImages([]);
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      console.log('app:useEffect: remove escape handler')
      window.removeEventListener('keydown', handler);
    }
  }, []);

  useEffect(() => {
    if (index == -1 && !tagPaneVisible) {
      console.log('app:useEffect: actually restore scroll');
      setTimeout(() => window.scrollTo(0, scrollPos), 0);
    }
  }, [index, scrollPos, tagPaneVisible]);

  // get all tags
  useEffect(() => {
    if (!pythonApi) return;

    pythonApi.get_all_tags().then(tags => {
      if (tags) {
        const newAllTags = tags.map(([tagText, tagType, tagPage, count]) => ({ tagText, tagType, tagPage, count }));
        if (!sortByTag) {
          newAllTags.sort((a, b) => b.count - a.count);
          console.log('got new tags, sorting by COUNT:', newAllTags);
        } else {
          newAllTags.sort((a, b) => a.tagText.toLowerCase().localeCompare(b.tagText.toLowerCase()));
          console.log('got new tags, sorting by TAG:', newAllTags);
        }
        setAllTags(newAllTags);
      } else {
        console.log('didnt get any tags????');
      }
    });
  }, [pythonApi, setAllTags, sortByTag]);

  // get images
  useEffect(() => {
    if (!pythonApi) return;

    // const images = Object.keys(tagsByImage);
    const includedTagTexts = includedTags.map((t) => t.tagText);
    const excludedTagTexts = excludedTags.map((t) => t.tagText);
    console.log(`useEffect: get_images include_tags=${includedTagTexts} excludedTags=${excludedTagTexts}`);

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

  // callback
  const addIncludedTag = ({ tagText }) => {
    console.log('include tag clicked:', tagText);
    if (!includedTags.find((tag) => tag.tagText == tagText)) {
      const ttag = allTags.find((tag) => tag.tagText == tagText)
      if (!ttag) {
        console.log('tf, couldnt find tag:', ttag);
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
    console.log(`EDIT MODE:removeTagFromImages tag:${tagText} images:`, selectedImages);
    if (!pythonApi) return;

    pythonApi.remove_tag_from_images(tagText, selectedImages).then((count) => {
      console.log('we removed ', count, ' tags from db, removing from state.');
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
    console.log(`EDIT MODE:addTagToImages tag:${tagText} images:`, selectedImages);
    if (!pythonApi) return;

    pythonApi.add_tag_to_images(tagText, selectedImages).then((count) => {
      console.log('we added', count, ' imagetags to db, updating state.');
      if (!count) return;

      const copy = { ...tagsByImage };
      for (const image of selectedImages) {
        const tags = copy[image];
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
  const renameTag = ({ oldTag, newTag }) => {
    if (!pythonApi) return;

    console.log(`rename REALLY ${oldTag} to ${newTag}`);
    pythonApi.rename_tag(oldTag, newTag).then(() => {
      const newAllTags = allTags.map((tag) => {
        if (tag.tagText == oldTag)
          tag.tagText = newTag;
        return tag;
      });
      setAllTags(newAllTags);
    });
  }

  /*
  // callback
  const setTagType = ({ tagText, tagType }) => {
    if (!pythonApi) return;

    pythonApi.set_tag_type(tagText, tagType).then(() => {
      const newAllTags = allTags.map((tag) => {
        if (tag.tagText == tagText) {
          tag.tagType = tagType;
        }
        return tag;
      });
      setAllTags(newAllTags);
    });
  }
  */

  // callback
  const setTagPage = ({ tagText, tagPage }) => {
    if (!pythonApi) return;

    pythonApi.set_tag_page(tagText, tagPage).then((count) => {
      if (count != 1) {
        console.log('error of some kind setting tag page');
        return;
      }

      const newAllTags = allTags.map((tag) => {
        if (tag.tagText == tagText) {
          tag.tagPage = tagPage;
        }
        return tag;
      });
      setAllTags(newAllTags);
    });
  }

  // callback
  const setIndexAndSelected = (index_) => {
    console.log('combine callback, set index to', index_);
    // TODO: aren't effects supposed to handle this 'if changed' logic
    if (index_ >= 0 && index_ != index) {
      console.log('callback: setting index to', index_);
      setIndex(index_);
      setSelectedImages([images[index_]]);
    } else {
      console.log('callback: not changing');
    }
  }

  const visibleTags = [];
  for (const v of Object.values(tagsByImage)) {
    for (const tagText of v) {
      if (!visibleTags.find((tag) => tag.tagText == tagText)) {
        const count = allTags.find((tag) => tag.tagText == tagText).count;
        visibleTags.push({ tagText, count });
      }
    }
  }
  visibleTags.sort((a, b) => b.count - a.count);


  const selectedTags = [];
  if (selectedImages && tagsByImage) {
    for (const image of selectedImages) {
      console.log('checking for tags on', image);
      if (!(image in tagsByImage)) {
        console.log('no tags sorry', image);
        continue;
      }
      console.log('found tags', tagsByImage[image]);
      for (const tagText of tagsByImage[image]) {
        if (!selectedTags.find((tag) => tag.tagText == tagText)) {
          const count = allTags.find((tag) => tag.tagText == tagText).count;
          selectedTags.push({tagText, count});
        }
      }
    }
  }
  selectedTags.sort((a, b) => b.count - a.count);

  const selectedTagReal = allTags.find((tag) => tag.tagText == selectedTag);
  console.log('selectedTagReal:', selectedTagReal, selectedTag);

  return (
    <KeyStoreProvider>
      <div className='header'>
        <nav className='navigation'>
          <button className={!tagPaneVisible ? 'selected_tab' : null}>
            <a onClick={() => { setTagPaneVisible(false); }}>Images</a>
          </button>
          <button className={tagPaneVisible ? 'selected_tab' : null}>
            <a onClick={() => { setTagPaneVisible(true); setScrollPos(window.pageYOffset); }}>Tags</a>
          </button>
        </nav>
      </div>

      { tagPaneVisible ? (

      <div>
        <div className='searchbar'>
          <div className='tagbox'>
            <FilterField setTagFilter={setTagFilter} />
          </div>
        </div>
        <div className='tagpane'>
          { selectedTag == '' ? (

          <table>
            <thead>
              <tr>
                <th><a onClick={() => {setSortByTag(true)}}>Tag</a></th>
                <th><a onClick={() => {setSortByTag(false)}}>Image count</a></th>
                <th><a>Category</a></th>
              </tr>
            </thead>
            <tbody>
              {allTags.filter((tag) => 
                (tagFilter == '' || tag.tagText.toLowerCase().includes(tagFilter.toLowerCase())))
                .map((tag) => 
                <tr key={tag.tagText}>
                  <td style={{display:'inline'}}><a href={'/' + tag.tagText} onClick={(e) => {setSelectedTag(tag.tagText); e.preventDefault()}}>?</a><EditableTagForm renameTag={renameTag} tagText={tag.tagText} /></td>
                  <td>{tag.count}</td>
                  <td>{tag.tagType}</td>
                </tr>
                )}
            </tbody>
          </table>

          ) : (

            <div>
              <p>Back to <a href='/' onClick={(e) => {setSelectedTag(''); e.preventDefault()}}>tags</a></p>
              <p>Info for tag {selectedTagReal.tagText}</p>
              <p>tag count: {selectedTagReal.count}</p>
              <p>tag type: {selectedTagReal.tagType}</p>
              <EditablePage
                tagPage={selectedTagReal.tagPage}
                setTagPage={(page) => {setTagPage({ tagText: selectedTagReal.tagText, tagPage: page })}}
              />
            </div>

          )}

        </div>
      </div>

      ) : (
      
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

      )}

    </KeyStoreProvider>
  );
}
