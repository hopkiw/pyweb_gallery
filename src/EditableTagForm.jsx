import React from 'react';
import { useRef } from 'react';


export default function EditableTagForm({ renameTag, tagText }) {
  const ref = useRef(undefined);

  return (
    <form
      style={{display:'inline'}}

      onSubmit={(e) => {

        if (ref.current.type == 'text') {
          console.log(`rename ${tagText} to ${ref.current.value}`);
          renameTag({oldTag: tagText, newTag: ref.current.value});
        }
        ref.current.type = (ref.current.type == 'text') ? 'submit' : 'text';
        e.preventDefault();
      }}
      onBlur={() => {
        ref.current.value = tagText;
        ref.current.type = 'submit';
      }}
    >
      <input type='text' defaultValue={tagText} ref={ref} />
    </form>
  );
}

