const express = require('express');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      res.json([]);
    } else {
      res.json(JSON.parse(data));
    }
  });
});

app.post('/api/notes', (req, res) => {
  const newNote = {
    id: uuid.v4(),
    title: req.body.title,
    text: req.body.text
  };

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      const notes = JSON.parse(data);
      notes.push(newNote);

      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.json(newNote);
        }
      });
    }
  });
});

app.delete('/api/notes/:id', (req, res) => {
  const noteId = req.params.id;

  fs.readFile(path.join(__dirname, 'db/db.json'), 'utf-8', (err, data) => {
    if (err) {
      console.log(err);
      res.sendStatus(500);
    } else {
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter((note) => note.id !== noteId);

      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(updatedNotes), (err) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
          res.sendStatus(200);
        }
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`App listening on PORT ${PORT}`);
});
