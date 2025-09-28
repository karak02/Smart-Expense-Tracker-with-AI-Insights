import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
});

export const getTransactions = () => api.get('/transactions/');
export const addTransaction = (transaction) => api.post('/transactions/', transaction);
export const updateTransaction = (id, transaction) => api.put(`/transactions/${id}`, transaction);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}`);

export default api;
