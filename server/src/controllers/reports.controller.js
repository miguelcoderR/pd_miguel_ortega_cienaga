import pool from '../config/database.js';

// Total paid by each customer
export const getTotalPaidByClient = async (req, res) => {
    try {
        const query = `
            SELECT 
                c.client_id, 
                c.full_name, 
                c.email,
                SUM(t.amount) AS total_paid
            FROM clients c
            JOIN invoices i ON c.client_id = i.client_id
            JOIN transactions t ON i.invoice_id = i.invoice_id
            GROUP BY c.client_id, c.full_name, c.email
            ORDER BY total_paid DESC;
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error generating the payment report by client' });
    }
};

// Pending invoices
export const getPendingInvoices = async (req, res) => {
    try {
        const query = `
            SELECT 
                i.invoice_number, 
                i.total_amount,
                i.issue_date,
                i.status,
                c.full_name AS client_name
            FROM invoices i
            JOIN clients c ON i.client_id = c.client_id
            WHERE i.status = 'pending'
            ORDER BY i.issue_date ASC;
        `;
        const [rows] = await pool.query(query);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error getting pending invoices' });
    }
};

// Transactions by platform
export const getTransactionsByPlatform = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ message: 'Please provide a platform ID.' });
    }
    try {
        const query = `
            SELECT 
                t.transaction_id,
                t.amount,
                t.transaction_date,
                p.name AS platform_name,
                i.invoice_number,
                c.full_name AS client_name
            FROM transactions t
            JOIN platforms p ON t.platform_id = p.platform_id
            JOIN invoices i ON t.invoice_id = i.invoice_id
            JOIN clients c ON i.client_id = c.client_id
            WHERE p.platform_id = ?
            ORDER BY t.transaction_date DESC;
        `;
        const [rows] = await pool.query(query, [id]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: 'Error getting transactions' });
    }
};