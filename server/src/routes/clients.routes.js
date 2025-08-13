import { Router } from 'express';
import {
    createClient,
    getAllClients,
    getClientById,
    updateClient,
    deleteClient
} from '../controllers/clients.controller.js';

const router = Router();

// Defines CRUD routes and associates them with a controller function

// GET /api/clients - Get all clients
router.get('/', getAllClients);

// POST /api/clients - create new client
router.post('/', createClient);

// GET /api/clients/:id - Get a client by its ID
router.get('/:id', getClientById);

// PUT /api/clients/:id - Update a client by its ID
router.put('/:id', updateClient);

// DELETE /api/clients/:id - Delete a client by its ID
router.delete('/:id', deleteClient);

export default router;