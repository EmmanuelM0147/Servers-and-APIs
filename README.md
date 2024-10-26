# Servers-and-APIs
This is for learning purpose only

## Overview
This project has two Node.js servers:
1. Web Server: Serves HTML files to clients.
2. Inventory API Server: Manages inventory items (CRUD operations).


## Usage

### Running the Servers
Start the servers:
node server.js


### Web Server
Access the web server on port 3000:
http://localhost:3000/index.html
If the file is not found, a 404 page is returned.

### Inventory API Server
API server runs on port 4000 for inventory CRUD operations.

- Create Item: `POST /api/items`

- Get All Items: `GET /api/items`

- Get One Item: `GET /api/items/:id`

- Update Item: `PUT /api/items/:id`

- Delete Item: `DELETE /api/items/:id`

### Example Commands
- Create an item: `POST -H http://localhost:4000/api/items`
- Get all items: `curl http://localhost:4000/api/items`


## Notes
- Persistence: Inventory data is stored in `items.json`.
- ID Generation: IDs are generated using timestamps.
- Error Handling: Errors are handled for invalid endpoints, data formats, and missing items.

## Improvements
- Use asynchronous file operations to avoid blocking.
- Implement better ID generation (e.g., UUIDs).
- Add validation for request data.

## License
Open-source. Modify and use as needed.

