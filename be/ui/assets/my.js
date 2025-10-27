/* jshint esversion: 10 */

var includedTags = [];
var excludedTags = [];
var allTags = [];
var commonTags = [];
var imageResults = [];

var visibleTags = new Set();

var selectedTag = "art";

// TODO: a tag shouldn't ever be in include&exclude simultaneously
// TODO: AND vs OR tags

async function getAllTags() {
  const url = '/getTags';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    allTags = [...result];
  } catch (error) {
    console.error(error.message);
  }
}

async function getImagesForTag() {
  const url = '/getImages';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tag: selectedTag })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    imageResults = [...result];
  } catch (error) {
    console.error(error.message);
  }
}

async function getTagsForImage(image) {
  // const url = `/getTags/${image}`;
  const url = '/getTags';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ image: image })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(error.message);
  }
}

async function updateVisibleTagList() {
  for (var i = 0; i < imageResults.length; i++) {
    const tags = await getTagsForImage(imageResults[i]);
    for (var j = 0; j < tags.length; j++) {
      visibleTags.add(tags[j]);
    }
    if (i == 0) {
      commonTags= [...tags];
    } else {
      for (var k = 0; k < commonTags.length; k++) {
        const tag = commonTags[k];
        if (!tags.includes(tag)) {
          commonTags.splice(k, 1);
        }
      }
    }
  }

  const div = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = 'Tags on these images:';
  div.appendChild(p);

  for (const tag of visibleTags) {
    const span = document.createElement('span');

    const incla = document.createElement('a');
    incla.textContent = '[+]';
    incla.className = 'add-include-tag';
    span.appendChild(incla);

    const excla = document.createElement('a');
    excla.textContent = '[-]';
    excla.className = 'add-exclude-tag';
    span.appendChild(excla);

    const taga = document.createElement('a');
    taga.textContent = tag + ' ';
    span.appendChild(taga);

    div.appendChild(span);
  }

  document.getElementById('all-tags').replaceChildren(div);

  const div2 = document.createElement('div');
  const p2 = document.createElement('p');
  p2.textContent = 'Tags common to all images:';
  div2.appendChild(p2);

  for (var m = 0; m < commonTags.length; m++) {
    const span = document.createElement('span');

    const incla = document.createElement('a');
    incla.textContent = '[+]';
    incla.className = 'add-include-tag';
    span.appendChild(incla);

    const excla = document.createElement('a');
    excla.textContent = '[-]';
    excla.className = 'add-exclude-tag';
    span.appendChild(excla);

    const taga = document.createElement('a');
    taga.textContent = commonTags[m] + ' ';
    span.appendChild(taga);

    div2.appendChild(span);

  }

  document.getElementById('common-tags').replaceChildren(div2);
}

function updateImages() {
  var children = [];
  for (var i = 0; i < imageResults.length; i++) {
    const div = document.createElement('div');
    div.className = 'item';

    const img = document.createElement('img');
    img.src = imageResults[i];

    div.appendChild(img);
    children.push(div);
  }

  const gallery = document.getElementById('gallery');
  gallery.replaceChildren(...children);
}

function updateIncludeTagList() {
  const ul = document.createElement('ul');

  for (var i = 0; i < includedTags.length; i++) {
    const li = document.createElement('li');

    const a1 = document.createElement('a');
    a1.textContent = '[-]';
    a1.addEventListener('click', removeIncludeTag, false);

    const a2 = document.createElement('a');
    a2.textContent = includedTags[i];

    li.appendChild(a1);
    li.appendChild(a2);
    ul.appendChild(li);
  }

  document.querySelector('#include-tags').replaceChildren(ul);
  // need to refresh search results
}

function updateExcludeTagList() {
  const ul = document.createElement('ul');

  for (var i = 0; i < excludedTags.length; i++) {
    const li = document.createElement('li');

    const a1 = document.createElement('a');
    a1.textContent = '[-]';
    a1.addEventListener('click', removeExcludeTag, false);

    const a2 = document.createElement('a');
    a2.textContent = excludedTags[i];

    li.appendChild(a1);
    li.appendChild(a2);
    ul.appendChild(li);
  }

  document.querySelector('#exclude-tags').replaceChildren(ul);
  // need to refresh search results
}

function addIncludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.nextSibling.text;
  if (!includedTags.includes(tagText)) {
     includedTags.push(tagText);
     updateIncludeTagList();
  }
  selectedTag = tagText;
  updateImages();
}

function addExcludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.text;
  if (!excludedTags.includes(tagText)) {
     excludedTags.push(tagText);
  }
  updateExcludeTagList();
}

function removeIncludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.text;

  includedTags.splice(includedTags.indexOf(tagText), 1);

  updateIncludeTagList();
}

function removeExcludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.text;

  excludedTags.splice(excludedTags.indexOf(tagText), 1);

  updateExcludeTagList();
}

async function handleForm (e) {
  e.preventDefault();

  const field = document.getElementById('form-include-tags-field');
  selectedTag = field.value;
  field.value = '';
  updateIncludeTagList();
  await getImagesForTag();
  await updateImages();
  await updateVisibleTagList();

}

document.querySelector('#form-include-tags').onsubmit = handleForm;

var addIncludeButtons = document.getElementsByClassName('add-include-tag');
for (var i = 0; i < addIncludeButtons.length; i++) {
  addIncludeButtons[i].addEventListener('click', addIncludeTag, false);
}

var addExcludeButtons = document.getElementsByClassName('add-exclude-tag');
for (var i = 0; i < addExcludeButtons.length; i++) {
  addExcludeButtons[i].addEventListener('click', addExcludeTag, false);
}

var removeIncludeButtons = document.getElementsByClassName('remove-include-tag');
for (var i = 0; i < removeIncludeButtons.length; i++) {
  removeIncludeButtons[i].addEventListener('click', removeIncludeTag, false);
}

var removeExcludeButtons = document.getElementsByClassName('remove-exclude-tag');
for (var i = 0; i < removeExcludeButtons.length; i++) {
  removeExcludeButtons[i].addEventListener('click', removeExcludeTag, false);
}

window.onload = () => {
  getAllTags();
  document.getElementById('form-include-tags-field').focus();
  // getImages();
  const gallery = document.querySelector('#gallery');
};
