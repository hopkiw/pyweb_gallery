import React from 'react';
import { useRef } from 'react';

export default function Tag({ tag, className, addTagHandler, removeTagHandler }) {
  const tagRef = useRef(null);
  if (!(tag)) {
    return null;
  }
  // console.log('Tag<> render', tag);

  return (
    <span>
      {addTagHandler ? (
        <a
          className={className ? `${className} add-tag` : 'add-tag'}
          onClick={(e) => addTagHandler({ e: e, tagText: tagRef.current.text })}
        >[+]</a>
      ) : null}

      {removeTagHandler ? (
        <a
          className={className ? `${className} remove-tag` : 'remove-tag'}
          onClick={(e) => removeTagHandler({ e: e, tagText: tagRef.current.text})}
        >[-]</a>
      ) : null}

      <a ref={tagRef} className={className}>{tag.tagText}</a><a>&nbsp;({tag.count})</a>
      <a>&nbsp;</a>
    </span>
  );
}
