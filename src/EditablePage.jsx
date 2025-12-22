export default function EditablePage({ tagPage, setTagPage }) {
  function handleSubmit(e) {
    e.preventDefault();

    // Read the form data
    const form = e.target;
    const formData = new FormData(form);

    // Or you can work with it as a plain object:
    const formJson = Object.fromEntries(formData.entries());
    console.log(formJson.tagPage);
    setTagPage(formJson.tagPage);
  }

  return (
    <form method="post" onSubmit={handleSubmit}>
      <label>
        Edit your post:
        <textarea
          name="tagPage"
          defaultValue={tagPage}
          rows={4}
          cols={40}
        />
      </label>
      <button type="submit">Save post</button>
    </form>
  );
}


