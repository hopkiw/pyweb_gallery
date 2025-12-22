import React from 'react';
import { useEffect, useState } from 'react';

import GalleryPane from './GalleryPane.jsx';
import TagPane from './TagPane.jsx';

import { KeyStoreProvider } from './KeyStoreProvider.jsx';
import { usePythonApi } from './usePythonApi.js';

export default function App() {
  const [allTags, setAllTags] = useState([]);
  const [tagPaneVisible, setTagPaneVisible] = useState(false);
  const [galleryScrollPos, setGalleryScrollPos] = useState(0);
  const [tagScrollPos, setTagScrollPos] = useState(0);

  // pythonApi
  const pythonApi = usePythonApi();

  // TODO: consistent style in effects & handlers
  // TODO: audit for unnecessary state , when setState((prevstate) => prevstate + 1) could be used
  // TODO: always refresh state from DB
  // TODO: tag pane: limit tags shown at a time ?

  // get all tags
  useEffect(() => {
    if (!pythonApi) return;

    pythonApi.get_all_tags().then(tags => {
      if (tags) {
        const newAllTags = tags.map(([tagText, tagType, tagPage, count]) => ({ tagText, tagType, tagPage, count }));
        newAllTags.sort((a, b) => b.count - a.count);
        setAllTags(newAllTags);
      } 
    });
  }, [pythonApi]);

  useEffect(() => {
    if (tagPaneVisible) {
      console.log('app: scroll tag pane to', tagScrollPos);
      setTimeout(() => window.scrollTo(0, tagScrollPos), 3000);
    } else {
      console.log('app: scroll gallery pane to', galleryScrollPos);
      setTimeout(() => window.scrollTo(0, galleryScrollPos), 3000);
    }
  }, [galleryScrollPos, tagPaneVisible, tagScrollPos]);

  // callback
  const createTag = ({ tagText }) => {
    if (!pythonApi) return;

    pythonApi.create_tag(tagText).then((count) => {
      if (!count) return;

      setAllTags([...allTags, tagText]);
    });
  }

  // callback
  const renameTag = ({ oldTag, newTag }) => {
    if (!pythonApi) return;

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

  return (
    <KeyStoreProvider>
      <div className='header'>
        <nav className='navigation'>
          <button className={!tagPaneVisible ? 'selected_tab' : null}>
            <a onClick={() => {
              setTagScrollPos(window.pageYOffset);
              setTagPaneVisible(false);
            }}>Images</a>
          </button>
          <button className={tagPaneVisible ? 'selected_tab' : null}>
            <a onClick={() => {
              setGalleryScrollPos(window.pageYOffset);
              setTagPaneVisible(true);
            }}>Tags</a>
          </button>
        </nav>
      </div>
      { tagPaneVisible ? (
        <TagPane
          allTags={allTags}
          renameTag={renameTag}
          setTagPage={setTagPage}
          scrollPos={tagScrollPos}
          setScrollPos={setTagScrollPos}
        />
      ) : (
        <GalleryPane
          allTags={allTags}
          createTag={createTag}
          scrollPos={galleryScrollPos}
          setScrollPos={setGalleryScrollPos}
        />
      )}
    </KeyStoreProvider>
  );
}
