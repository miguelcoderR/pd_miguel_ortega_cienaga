import { Router } from 'express';
import {
    getTotalPaidByClient,
    getPendingInvoices,
    getTransactionsByPlatform
} from '../controllers/reports.controller.js';

const router = Router();

// URLs for each report
router.get('/total-paid-by-client', getTotalPaidByClient);
router.get('/pending-invoices', getPendingInvoices);
router.get('/transactions-by-platform', getTransactionsByPlatform);

export default router;