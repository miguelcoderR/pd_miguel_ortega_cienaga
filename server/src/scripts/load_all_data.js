import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import pool from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const formatDate = (dateString) => {
    if (!dateString || dateString.trim() === '') return null;
    const date = new Date(dateString);
    return !isNaN(date) ? date.toISOString().slice(0, 10) : null;
};

const loadAllData = async (fileName) => {
    const connection = await pool.getConnection();
    console.log('🚀 Starting unified bulk upload...');

    try {
        await connection.beginTransaction();

        const [platformRows] = await connection.query('SELECT * FROM platforms');
        const platformsMap = new Map(platformRows.map(p => [p.name.toLowerCase(), p.platform_id]));

        const csvFilePath = path.join(__dirname, `../../data/${fileName}`);
        const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
        const records = parse(fileContent, { columns: true, skip_empty_lines: true, trim: true });
        
        console.log(`CSV file read. Will be processed. ${records.length} records.`);

        for (const rec of records) {
            // Client (Insert if does not exist) ---
            let [client] = await connection.query('SELECT client_id FROM clients WHERE identification_number = ?', [rec.identification_number]);
            let clientId;

            if (client.length === 0) {
                const [clientResult] = await connection.query(
                    'INSERT INTO clients (identification_number, full_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
                    [rec.identification_number, rec.full_name, rec.email, rec.phone || null, rec.address || null]
                );
                clientId = clientResult.insertId;
            } else {
                clientId = client[0].client_id;
            }

            // ---Invoice (Insert) ---
            const [invoiceResult] = await connection.query(
                'INSERT INTO invoices (invoice_number, client_id, total_amount, billing_period, issue_date, `status`) VALUES (?, ?, ?, ?, ?, ?)',
                [rec.invoice_number, clientId, rec.total_amount, rec.billing_period || null, formatDate(rec.transaction_date), rec.status === 'completed' ? 'paid' : 'pending']
            );
            const invoiceId = invoiceResult.insertId;
            
            // --- Transaction (Insert) ---
            const platformId = platformsMap.get(rec.name.toLowerCase());
            if (!platformId) continue;

            await connection.query(
                'INSERT INTO transactions (transaction_id, invoice_id, platform_id, amount, transaction_date, `status`, `type`) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [rec.transaction_id, invoiceId, platformId, rec.amount, new Date(rec.transaction_date), rec.status, rec.type]
            );
        }

        await connection.commit();
        console.log('✅ Bulk upload completed successfully.');

    } catch (error) {
        await connection.rollback();
        console.error('❌ Error during bulk upload. The transaction has been rolled back.', error);
    } finally {
        connection.release();
        pool.end();
    }
};

// --- execution ---
loadAllData('movimientos.csv');