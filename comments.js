// Create web server

// Import dependencies
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create web server
const app = express();

// Use dependencies
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Set port
const port = process.env.PORT || 3000;

// Set data
const dataPath = path.join(__dirname, 'data', 'comments.json');

// Get comments
app.get('/comments', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occurred');
    } else {
      res.status(200).send(JSON.parse(data));
    }
  });
});

// Post comments
app.post('/comments', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occurred');
    } else {
      const comments = JSON.parse(data);
      const newComment = {
        id: uuidv4(),
        ...req.body,
      };
      comments.push(newComment);
      fs.writeFile(dataPath, JSON.stringify(comments), (err) => {
        if (err) {
          res.status(500).send('An error occurred');
        } else {
          res.status(200).send('Comment added');
        }
      });
    }
  });
});

// Delete comments
app.delete('/comments/:id', (req, res) => {
  fs.readFile(dataPath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('An error occurred');
    } else {
      const comments = JSON.parse(data);
      const filteredComments = comments.filter((comment) => comment.id !== req.params.id);
      fs.writeFile(dataPath, JSON.stringify(filteredComments), (err) => {
        if (err) {
          res.status(500).send('An error occurred');
        } else {
          res.status(200).send('Comment deleted');
        }
      });
    }
  });
});

// Start web server
app.listen(port, () => {
  console.log(`Server listening on