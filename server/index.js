/*// index.js
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const connection = require('./db');

// Server setup
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    // Handle different routes
    if (reqUrl.pathname === '/') {
        // Serve index.html as homepage
        const filePath = path.join(__dirname, '..', 'index.html');
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (reqUrl.pathname === '/api/recipes') {
        // Handle API endpoints for recipes (CRUD operations)
        if (req.method === 'GET') {
            // Implement GET method to fetch recipes
        } else if (req.method === 'POST') {
            // Implement POST method to create a new recipe
        } else if (req.method === 'PUT') {
            // Implement PUT method to update a recipe
        } else if (req.method === 'DELETE') {
            // Implement DELETE method to delete a recipe
        }
    } else {
        // Handle 404 - Not Found
        res.writeHead(404);
        res.end('404 - Not Found');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
*/
// ================================================

// server/index.js

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const connection = require('./db');
const { parse } = require('querystring');

// Utility function to parse JSON body
const parseJsonBody = (req, callback) => {
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        callback(JSON.parse(body));
    });
};

// Server setup
const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);
    const method = req.method;

    if (reqUrl.pathname === '/') {
        // Serve index.html as homepage
        const filePath = path.join(__dirname, '..', 'index.html');
        fs.readFile(filePath, 'utf8', (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content);
        });
    } else if (reqUrl.pathname.startsWith('/api/recipes')) {
        if (method === 'GET') {
            if (reqUrl.pathname === '/api/recipes') {
                // Get all recipes
                connection.query('SELECT * FROM recipes', (error, results) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to fetch recipes' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results));
                });
            } else {
                // Get a single recipe by id
                const id = reqUrl.pathname.split('/')[3];
                connection.query('SELECT * FROM recipes WHERE id = ?', [id], (error, results) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to fetch recipe' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(results[0]));
                });
            }
        } else if (method === 'POST') {
            // Create a new recipe
            parseJsonBody(req, (recipe) => {
                const { user_id, title, description, ingredients, steps } = recipe;
                connection.query('INSERT INTO recipes (user_id, title, description, ingredients, steps) VALUES (?, ?, ?, ?, ?)', [user_id, title, description, ingredients, steps], (error, results) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to create recipe' }));
                        return;
                    }
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ id: results.insertId }));
                });
            });
        } else if (method === 'PUT') {
            // Update a recipe by id
            const id = reqUrl.pathname.split('/')[3];
            parseJsonBody(req, (recipe) => {
                const { title, description, ingredients, steps } = recipe;
                connection.query('UPDATE recipes SET title = ?, description = ?, ingredients = ?, steps = ? WHERE id = ?', [title, description, ingredients, steps, id], (error) => {
                    if (error) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: 'Failed to update recipe' }));
                        return;
                    }
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Recipe updated successfully' }));
                });
            });
        } else if (method === 'DELETE') {
            // Delete a recipe by id
            const id = reqUrl.pathname.split('/')[3];
            connection.query('DELETE FROM recipes WHERE id = ?', [id], (error) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Failed to delete recipe' }));
                    return;
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Recipe deleted successfully' }));
            });
        } else {
            res.writeHead(405, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Method not allowed' }));
        }
    } else {
        // Handle 404 - Not Found
        res.writeHead(404);
        res.end('404 - Not Found');
    }
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

