import React from 'react';
import { useEffect, useRef, useState } from 'react';

import EditablePage from './EditablePage.jsx';
import EditableTagForm from './EditableTagForm.jsx';

function FilterField({ setTagFilter }) {
  const ref = useRef(undefined);

  return (
    <input type='search' onChange={() => {
      setTagFilter(ref.current.value);
    }} ref={ref} className='filterfield' />
  );
}

export default function TagPane({ allTags, renameTag, setTagPage, scrollPos, setScrollPos }) {
  const [tagFilter, setTagFilter] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortByTag, setSortByTag] = useState(false);

  // reset scroll
  useEffect(() => {
    if (selectedTag == '') {
      console.log('scrolling tagpane');
      setTimeout(() => window.scrollTo(0, scrollPos), 0);
    }
  }, [selectedTag, scrollPos]);

  const selectedTagReal = allTags.find((tag) => tag.tagText == selectedTag);
  console.log('sortByTag:', sortByTag);

  return (
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
                <td style={{display:'inline'}}>
                  <a href={'/' + tag.tagText} onClick={(e) => {
                    setScrollPos(window.pageYOffset);
                    setSelectedTag(tag.tagText);
                    e.preventDefault();
                  }}>?</a>
                  <EditableTagForm
                    renameTag={renameTag}
                    tagText={tag.tagText}
                  />
                </td>
                <td>{tag.count}</td>
                <td>{tag.tagType}</td>
              </tr>
              )}
          </tbody>
        </table>

        ) : (

          <div>
            <p>Back to <a href='/' onClick={(e) => {
              setSelectedTag('');
              e.preventDefault();
            }}>tags</a></p>
            <p>Info for tag {selectedTagReal.tagText}</p>
            <p>tag count: {selectedTagReal.count}</p>
            <p>tag type: {selectedTagReal.tagType}</p>
            <EditablePage
              tagPage={selectedTagReal.tagPage}
              setTagPage={(page) => {
                setTagPage({ tagText: selectedTagReal.tagText, tagPage: page });
              }}
            />
          </div>

        )}

      </div>
    </div>
  );
}
