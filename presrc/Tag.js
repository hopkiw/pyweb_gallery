import React from 'react';
import { useRef } from 'react';

export default function Tag({ tag, addTagHandler, removeTagHandler }) {
  const tagRef = useRef(null);
  if (!(tag)) {
    return null;
  }

  return (
    <span>
      {addTagHandler ? (
        <a
          className="add-tag"
          onClick={(e) => addTagHandler(e, tagRef.current.text)}
        >[+]</a>
      ) : null}

      {removeTagHandler ? (
        <a
          className="remove-tag"
          onClick={(e) => removeTagHandler(e, tagRef.current.text)}
        >[-]</a>
      ) : null}

      <a ref={tagRef}>{tag}</a>
      <a>&nbsp;</a>
    </span>
  );
}
