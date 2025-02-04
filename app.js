const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Simulated database (in-memory array of items)
let items = [
  { id: 1, name: "Sample Item 1", description: "This is a sample item" },
  { id: 2, name: "Sample Item 2", description: "This is another sample item" }
];

// Set the 'views' directory to be one level deeper
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Routes
// Homepage
app.get('/', (req, res) => {
  res.render('index', { title: 'Homepage' });
});

// View Items
app.get('/items', (req, res) => {
  res.render('items', { title: 'View Items', items });
});

// Add Item Form
app.get('/add-item', (req, res) => {
  res.render('add-item', { title: 'Add Item' });
});

// Add Item (POST)
app.post('/add-item', (req, res) => {
  const { name, description } = req.body;
  
  // Basic validation
  if (!name || !description) {
    return res.render('add-item', {
      title: 'Add Item',
      error: 'Both name and description are required.'
    });
  }
  
  const newItem = {
    id: items.length + 1,
    name,
    description
  };
  items.push(newItem);
  res.redirect('/items');
});

// Edit Item Form
app.get('/edit-item/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  
  // Handle case if item is not found
  if (!item) {
    return res.redirect('/items');
  }

  res.render('edit-item', { title: 'Edit Item', item });
});

// Edit Item (POST)
app.post('/edit-item/:id', (req, res) => {
  const item = items.find(i => i.id == req.params.id);
  
  // Handle case if item is not found
  if (!item) {
    return res.redirect('/items');
  }

  const { name, description } = req.body;

  // Basic validation
  if (!name || !description) {
    return res.render('edit-item', {
      title: 'Edit Item',
      item,
      error: 'Both name and description are required.'
    });
  }

  item.name = name;
  item.description = description;
  res.redirect('/items');
});

// Delete Item
app.get('/delete-item/:id', (req, res) => {
  items = items.filter(i => i.id != req.params.id);
  res.redirect('/items');
});

// Start Server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server running on http://0.0.0.0:3000');
});
