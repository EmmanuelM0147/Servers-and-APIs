// Import modules
const http = require('http');
const fs = require('fs');
const path = require('path');

// Paths
const HTML_DIR = path.join(__dirname, 'html');
const ITEMS_FILE = path.join(__dirname, 'items.json');

// Helper to r/w items.json
const readItems = () => {
  if (!fs.existsSync(ITEMS_FILE)) return [];
  const data = fs.readFileSync(ITEMS_FILE);
  return JSON.parse(data);
};

const writeItems = (items) => {
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
};

// Server
const webServer = http.createServer((req, res) => {
  const filePath = path.join(HTML_DIR, req.url);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Page Not Found</h1>');
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

// API
const apiServer = http.createServer((req, res) => {
  const items = readItems();

  if (req.url.startsWith('/api/items')) {
    
    // Create post & api items 
    if (req.method === 'POST' && req.url === '/api/items') {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const newItem = JSON.parse(body);
          newItem.id = new Date().getTime(); 
          
    // Simple unique ID
          items.push(newItem);
          writeItems(items);
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, data: newItem }));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid data format' }));
        }
      });
    }
    // Get all api items
    else if (req.method === 'GET' && req.url === '/api/items') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, data: items }));
    }
    // Get one api item with id
    else if (req.method === 'GET' && req.url.match(/^\/api\/items\/\d+$/)) {
      const id = parseInt(req.url.split('/')[3]);
      const item = items.find((i) => i.id === id);
      if (item) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: item }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Item not found' }));
      }
    }
    // Update api item
    else if (req.method === 'PUT' && req.url.match(/^\/api\/items\/\d+$/)) {
      const id = parseInt(req.url.split('/')[3]);
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', () => {
        try {
          const updatedItem = JSON.parse(body);
          const itemIndex = items.findIndex((i) => i.id === id);
          if (itemIndex >= 0) {
            items[itemIndex] = { ...items[itemIndex], ...updatedItem, id };
            writeItems(items);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, data: items[itemIndex] }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: 'Item not found' }));
          }
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Invalid data format' }));
        }
      });
    }
      
    // Delete api item 
    else if (req.method === 'DELETE' && req.url.match(/^\/api\/items\/\d+$/)) {
      const id = parseInt(req.url.split('/')[3]);
      const itemIndex = items.findIndex((i) => i.id === id);
      if (itemIndex >= 0) {
        const deletedItem = items.splice(itemIndex, 1);
        writeItems(items);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, data: deletedItem }));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Item not found' }));
      }
    }
      
    // Invalid API Endpoint
    else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, error: 'Endpoint not found' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

// Start both web and api servers
webServer.listen(3000, () => console.log('Web Server listening on port 3000...'));
apiServer.listen(4000, () => console.log('API Server listening on port 4000...'));
