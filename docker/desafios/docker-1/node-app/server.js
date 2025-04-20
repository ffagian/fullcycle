const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

const connection = mysql.createConnection(dbConfig);

connection.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        process.exit(1);
    }
    console.log('Connected to the database.');
});

app.get('/', (req, res) => {
    const name = `User ${Math.floor(Math.random() * 1000)}`;
    connection.query('INSERT INTO people (name) VALUES (?)', [name], err => {
        if (err) {
            console.error('Error inserting into database:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        connection.query('SELECT name FROM people', (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                res.status(500).send('Internal Server Error');
                return;
            }

            const namesList = results.map(row => `<li>${row.name}</li>`).join('');
            res.send(`<h1>Full Cycle Rocks!</h1><ul>${namesList}</ul>`);
        });
    });
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});
