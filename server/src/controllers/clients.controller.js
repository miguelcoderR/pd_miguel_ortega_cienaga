import pool from '../config/database.js';

// create new client
export const createClient = async (req, res) => {
    const { identification_number, full_name, email, phone, address } = req.body;
    if (!identification_number || !full_name || !email) {
        return res.status(400).json({ message: 'ID, name and email are required.' });
    }
    try {
        const [result] = await pool.query(
            'INSERT INTO clients (identification_number, full_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
            [identification_number, full_name, email, phone, address]
        );
        const [newClient] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [result.insertId]);
        res.status(201).json(newClient[0]);
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'The email or ID number is already registered.' });
        }
        res.status(500).json({ message: 'error creating client' });
    }
};

// Get all clients
export const getAllClients = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM clients ORDER BY client_id DESC');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error getting clients' });
    }
};

// Get a client by ID
export const getClientById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
        res.status(200).json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error getting client' });
    }
};

// update client
export const updateClient = async (req, res) => {
    try {
        const { id } = req.params;
        const { identification_number, full_name, email, phone, address } = req.body;
        const [result] = await pool.query(
            'UPDATE clients SET identification_number = ?, full_name = ?, email = ?, phone = ?, address = ? WHERE client_id = ?',
            [identification_number, full_name, email, phone, address, id]
        );
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Client not fund' });
        const [updatedClient] = await pool.query('SELECT * FROM clients WHERE client_id = ?', [id]);
        res.status(200).json(updatedClient[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating the client' });
    }
};

// delete client
export const deleteClient = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM clients WHERE client_id = ?', [id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Client not fund' });
        res.sendStatus(204); // 204: No Content
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client' });
    }
};