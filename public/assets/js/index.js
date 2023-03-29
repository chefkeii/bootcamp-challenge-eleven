const newNoteBtn = document.getElementById('new-note');
const saveNoteBtn = document.getElementById('save-note');
const noteTitleInput = document.getElementById('note-title');
const noteTextInput = document.getElementById('note-text');
const noteList = document.getElementById('note-list');
let activeNote = {};

// Show the note editor and hide the note list when the "new note" button is clicked
const showNoteEditor = () => {
  document.getElementById('note-editor').style.display = 'block';
  document.getElementById('note-list-container').style.display = 'none';
  noteTitleInput.value = '';
  noteTextInput.value = '';
  activeNote = {};
};

// Show the note list and hide the note editor when the "cancel" button is clicked
const cancelNoteEditor = () => {
  document.getElementById('note-editor').style.display = 'none';
  document.getElementById('note-list-container').style.display = 'block';
};

// Render the note list from the server
const renderNoteList = (notes) => {
  noteList.innerHTML = '';
  notes.forEach((note) => {
    const noteItem = document.createElement('li');
    noteItem.classList.add('list-group-item');
    noteItem.dataset.id = note.id;

    const noteTitle = document.createElement('h5');
    noteTitle.classList.add('list-item-title');
    noteTitle.textContent = note.title;

    const deleteButton = document.createElement('i');
    deleteButton.classList.add('far', 'fa-trash-alt', 'float-right');

    noteItem.appendChild(noteTitle);
    noteItem.appendChild(deleteButton);

    noteList.appendChild(noteItem);
  });
};

// Get the notes from the server and render the note list
const getNotes = () => {
  fetch('/api/notes')
    .then((response) => response.json())
    .then((data) => renderNoteList(data));
};

// Save a new note to the server and update the note list
const saveNote = () => {
  const title = noteTitleInput.value.trim();
  const text = noteTextInput.value.trim();

  if (title && text) {
    const data = { title, text };
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };

    fetch('/api/notes', options)
      .then((response) => response.json())
      .then((data) => {
        activeNote = data;
        cancelNoteEditor();
        getNotes();
      });
  }
};

// Delete a note from the server and update the note list
const deleteNote = (id) => {
  const options = { method: 'DELETE' };
  fetch(`/api/notes/${id}`, options)
    .then(() => {
      if (activeNote.id === id) {
        activeNote = {};
      }
      getNotes();
    });
};

// Load an existing note into the note editor
const loadNote = (id) => {
  fetch(`/api/notes/${id}`)
    .then((response) => response.json())
    .then((data) => {
      activeNote = data;
      noteTitleInput.value = activeNote.title;
      noteTextInput.value = activeNote.text;
      showNoteEditor();
    });
};

// Event listeners
newNoteBtn.addEventListener('click', showNoteEditor);
saveNoteBtn.addEventListener('click', saveNote);
noteList.addEventListener('click', (event) => {
  if (event.target.matches('.list-item-title')) {
    const id = event.target.parentElement.dataset.id;
    loadNote(id);
  } else if (event.target.matches('.fa-trash-alt')) {
    const id = event.target.parentElement.dataset.id;
    deleteNote(id);
  }
});
