const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db'); // Import the database connection

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Homepage
app.get('/', (req, res) => {
  res.render('index', { title: 'Homepage' });
});

// View Items
app.get('/items', (req, res) => {
  const query = 'SELECT * FROM items';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.send('Error fetching items');
    }
    res.render('items', { title: 'View Items', items: results });
  });
});

// Add Item Form
app.get('/add-item', (req, res) => {
  res.render('add-item', { title: 'Add Item' });
});

// Add Item (POST)
app.post('/add-item', (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.render('add-item', { title: 'Add Item', error: 'Both name and description are required.' });
  }

  const query = 'INSERT INTO items (name, description) VALUES (?, ?)';
  db.query(query, [name, description], (err) => {
    if (err) {
      console.error('Error inserting item:', err);
      return res.send('Error inserting item');
    }
    res.redirect('/items');
  });
});

// Edit Item Form
app.get('/edit-item/:id', (req, res) => {
  const query = 'SELECT * FROM items WHERE id = ?';
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error('Error fetching item:', err);
      return res.send('Error fetching item');
    }
    if (results.length === 0) return res.redirect('/items');
    res.render('edit-item', { title: 'Edit Item', item: results[0] });
  });
});

// Edit Item (POST)
app.post('/edit-item/:id', (req, res) => {
  const { name, description } = req.body;
  const query = 'UPDATE items SET name = ?, description = ? WHERE id = ?';

  db.query(query, [name, description, req.params.id], (err) => {
    if (err) {
      console.error('Error updating item:', err);
      return res.send('Error updating item');
    }
    res.redirect('/items');
  });
});

// Delete Item
app.get('/delete-item/:id', (req, res) => {
  const query = 'DELETE FROM items WHERE id = ?';
  db.query(query, [req.params.id], (err) => {
    if (err) {
      console.error('Error deleting item:', err);
      return res.send('Error deleting item');
    }
    res.redirect('/items');
  });
});

// Start Server
app.listen(3000, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
