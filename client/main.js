const API_URL = 'http://localhost:3000/api/clients';

// References to DOM elements
const clientForm = document.getElementById('client-form');
const clientsTableBody = document.getElementById('clients-table-body');
const formTitle = document.getElementById('form-title');
const clientIdInput = document.getElementById('client-id');
const cancelEditBtn = document.getElementById('cancel-edit-btn');

// Function to get and display all customers
const getClients = async () => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('The clients could not be obtained.');
        const clients = await response.json();
        renderClients(clients);
    } catch (error) {
        alert(error.message);
    }
};

// Function to "draw" customers in the table
const renderClients = (clients) => {
    clientsTableBody.innerHTML = '';
    if (clients.length === 0) {
        clientsTableBody.innerHTML = `<tr><td colspan="7" class="text-center">There are no clients to display.</td></tr>`;
        return;
    }
    clients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${client.client_id}</td>
            <td>${client.identification_number}</td>
            <td>${client.full_name}</td>
            <td>${client.email}</td>
            <td>${client.phone || 'N/A'}</td>
            <td>${client.address || 'N/A'}</td>
            <td class="text-center">
                <button class="btn btn-warning btn-sm" onclick="editClient(${client.client_id})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteClient(${client.client_id})">Delete</button>
            </td>
        `;
        clientsTableBody.appendChild(row);
    });
};

// Function to handle form submission (Create and Update)
const submitForm = async (event) => {
    event.preventDefault();
    const id = clientIdInput.value;
    const clientData = {
        identification_number: document.getElementById('identification_number').value,
        full_name: document.getElementById('full_name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${API_URL}/${id}` : API_URL;

    try {
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(clientData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'An error occurred');
        }

        alert(`Client ${id ? 'updated' : 'created'} successfully.`);
        resetForm();
        await getClients();
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
};

// Function to delete a client
const deleteClient = async (id) => {
    if (confirm('¿Are you sure you want to delete this client?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('The client could not be deleted.');
            alert('Client successfully deleted.');
            await getClients();
        } catch (error) {
            alert(error.message);
        }
    }
};

// Function to prepare the form for editing
const editClient = async (id) => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) throw new Error('Could not get client for editing.');
        const client = await response.json();

        formTitle.textContent = 'Edit Client';
        clientIdInput.value = client.client_id;
        document.getElementById('identification_number').value = client.identification_number;
        document.getElementById('full_name').value = client.full_name;
        document.getElementById('email').value = client.email;
        document.getElementById('phone').value = client.phone;
        document.getElementById('address').value = client.address;
        
        cancelEditBtn.classList.remove('d-none');
        window.scrollTo(0, 0);
    } catch (error) {
        alert(error.message);
    }
};

// Function to clear and reset the form
const resetForm = () => {
    formTitle.textContent = 'Add New Client';
    clientForm.reset();
    clientIdInput.value = '';
    cancelEditBtn.classList.add('d-none');
};

// Event Listeners: Connect user actions to our functions
clientForm.addEventListener('submit', submitForm);
cancelEditBtn.addEventListener('click', resetForm);
// Load initial clients when the page is ready
document.addEventListener('DOMContentLoaded', getClients);