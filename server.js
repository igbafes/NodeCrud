            const express = require('express');
            const bodyParser = require('body-parser');
            const fs = require('fs');

            const app = express();
            const PORT = 3000;
            const DB_FILE = 'database.json';

            // Middleware
            app.use(bodyParser.json());

            // Read data from the database file
            const getData = () => {
            try {
                const data = fs.readFileSync(DB_FILE);
                return JSON.parse(data);
            } catch (error) {
                return [];
            }
            };

            // Write data to the database file
            const saveData = (data) => {
            fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
            };

            // GET all data
            app.get('/', (req, res) => {
            const data = getData();
            res.json(data);
            });

            // POST new data
            app.post('/', (req, res) => {
            const data = getData();
            const newData = req.body;
            newData.id = Date.now(); // Generate a unique ID
            newData.createdAt = new Date().toISOString();
            newData.updatedAt = new Date().toISOString();
            data.push(newData);
            saveData(data);
            res.status(201).json(newData);
            });

            // PUT update data by ID
            app.put('/:id', (req, res) => {
            const data = getData();
            const id = parseInt(req.params.id);
            const updatedData = req.body;
            updatedData.id = id;
            updatedData.updatedAt = new Date().toISOString();
            const index = data.findIndex((item) => item.id === id);
            if (index === -1) {
                return res.status(404).json({ message: 'Data not found' });
            }
            data[index] = updatedData;
            saveData(data);
            res.json(updatedData);
            });

            // DELETE data by ID
            app.delete('/:id', (req, res) => {
            const data = getData();
            const id = parseInt(req.params.id);
            const index = data.findIndex((item) => item.id === id);
            if (index === -1) {
                return res.status(404).json({ message: 'Data not found' });
            }
            const deletedData = data.splice(index, 1)[0];
            saveData(data);
            res.json(deletedData);
            });

            // Start the server
            app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            });