import React from 'react';

export default function Tag({ tag, addTagHandler, removeTagHandler }) {
  return (
    <span>
      {addTagHandler ? (
        <a
          className="addTag"
          onClick={addTagHandler}
        >[+]</a>
      ) : null}

      {removeTagHandler ? (
        <a
          className="removeTag"
          onClick={removeTagHandler}
        >[-]</a>
      ) : null}

      <a>{tag}</a>
      <a>&nbsp;</a>
    </span>
  );
}
