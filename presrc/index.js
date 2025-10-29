/* jshint esversion: 10 */

// TODO: this isn't supposed to be required anymore...?
import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.js';

// Clear the existing HTML content
// document.body.innerHTML = '<div id="app"></div>';

// Render your React component instead
// const root = createRoot(document.getElementById('app'));
const root = createRoot(document.body);

root.render(<App />);

/*
import DragSelect from "/DragSelect.esm.js";

const ds = new DragSelect({
  draggability: false,
});

ds.subscribe("DS:end", (e) => {
  console.log('DS:end', e);
  if (e.items) {
    selectedImages = e.items;
  } else {
    selectedImages = [];
  }
});
var selectedImages = [];
*/

/*
var includedTags = [];
var excludedTags = [];
var allTags = [];
var commonTags = [];
var imageResults = [];

var imageTags = {};
var visibleTags = new Set();

// TODO: a tag shouldn't ever be in include&exclude simultaneously

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

async function getImagesForTags() {
  if (includedTags.length == 0) {
    imageResults = [];
    return;
  }

  const url = '/getImages';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ tags: includedTags })
    });
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const result = await response.json();
    imageResults = [...result];
    console.log('got results:', imageResults);
  } catch (error) {
    console.error(error.message);
  }
}

async function getTagsForImages(images) {
  if (images.length == 0) {
    return [];
  }

  const url = '/getTags';
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ images: images })
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
  const tags = await getTagsForImages(imageResults);
  visibleTags.clear();
  for (const [image, itags] of Object.entries(tags)) {
    for (var i = 0; i < itags.length; i++) {
      visibleTags.add(itags[i]);
    }
  }
  imageTags = tags;

  const div = document.createElement('div');
  const p = document.createElement('p');
  p.textContent = 'Tags on these images:';
  div.appendChild(p);

  for (const tag of visibleTags) {
    const span = document.createElement('span');

    const incla = document.createElement('a');
    incla.textContent = '[+]';
    incla.className = 'add-include-tag';
    incla.addEventListener('click', addIncludeTag, false);
    span.appendChild(incla);

    const excla = document.createElement('a');
    excla.textContent = '[-]';
    excla.className = 'add-exclude-tag';
    excla.addEventListener('click', addExcludeTag, false);
    span.appendChild(excla);

    const taga = document.createElement('a');
    taga.textContent = tag;
    span.appendChild(taga);

    div.appendChild(span);
  }

  document.getElementById('all-tags').replaceChildren(div);
}

function updateImages() {
  var children = [];
  for (var i = 0; i < imageResults.length; i++) {
    const div = document.createElement('div');
    div.classList.add('item');
    div.classList.add('selectable');

    const img = document.createElement('img');
    // img.className = 'selectable';
    img.src = imageResults[i];

    div.appendChild(img);
    children.push(div);
  }

  const gallery = document.getElementById('gallery');
  gallery.replaceChildren(...children);
  ds.setSettings({
    selectables: children,
  });
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
}

async function addIncludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.nextSibling.text;
  if (!includedTags.includes(tagText)) {
     includedTags.push(tagText);
     updateIncludeTagList();
  }
  await getImagesForTags();
  updateImages();
  await updateVisibleTagList();
}

async function addExcludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.text;
  if (!excludedTags.includes(tagText)) {
     excludedTags.push(tagText);
  }
  updateExcludeTagList();
}

async function removeIncludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.text;
  includedTags.splice(includedTags.indexOf(tagText), 1);
  updateIncludeTagList();
  await getImagesForTags();
  updateImages();
  await updateVisibleTagList();
}

async function removeExcludeTag () {
  // hardcoded expectation of structure
  var tagText = this.nextSibling.text;
  excludedTags.splice(excludedTags.indexOf(tagText), 1);
  updateExcludeTagList();
}

async function handleForm (e) {
  e.preventDefault();

  const field = document.getElementById('form-include-tags-field');
  includedTags.push(field.value);
  field.value = '';
  updateIncludeTagList();
  await getImagesForTags();
  await updateImages();
  await updateVisibleTagList();

}

document.querySelector('#form-include-tags').onsubmit = handleForm;
*/

window.onload = () => {
  // getAllTags();
  document.getElementById('form-include-tags-field').focus();
};
