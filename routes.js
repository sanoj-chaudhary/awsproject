const express = require('express');
const router = express.Router();
const db = require('./db');

// CREATE
router.post('/users', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO users (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ id: result.insertId, name, email });
    });
});

// READ ALL
router.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results);
    });
});

// UPDATE
router.put('/users/:id', (req, res) => {
    const { name, email } = req.body;
    db.query('UPDATE users SET name = ?, email = ? WHERE id = ?', [name, email, req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ id: req.params.id, name, email });
    });
});

// DELETE
router.delete('/users/:id', (req, res) => {
    db.query('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Deleted' });
    });
});

module.exports = router;
