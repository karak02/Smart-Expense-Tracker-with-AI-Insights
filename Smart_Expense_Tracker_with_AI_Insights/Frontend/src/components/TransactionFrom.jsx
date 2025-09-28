import React, { useState, useEffect } from 'react';
import { addTransaction, updateTransaction } from '../api/transactionApi';




const TransactionFrom = ({ transaction = null, onSuccess, onCancel }) => {

    const [formData, setFormData] = useState({
        date: "",
        description: "",
        category: "",
        is_income: false,
        amount: ""
    })

    // fill form when editing
    useEffect(() => {
        if (transaction) {
            setFormData({
                date: transaction.date || "",
                description: transaction.description || "",
                category: transaction.category || "",
                is_income: transaction.is_income || false,
                amount: transaction.amount || ""
            })
        }
    },[transaction])

    const handleChange = (event) => {
        const { name, type, value, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    let response;
    if (transaction) {
      response = await updateTransaction(transaction.id, formData);
    } else {
      response = await addTransaction(formData);
    }
    onSuccess && onSuccess(response.data);
    if (!transaction) {
      setFormData({
        date: '',
        description: '',
        category: '',
        is_income: false,
        amount: '',
      });
    }
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
};


    return (
        <form onSubmit={handleSubmit} className="bg-white text-gray-500 w-full max-w-[340px] mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10 ">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">{ transaction ? "Upsate Transaction" : "Add Transaction" }</h2>

            <input name="date" value={formData.date} onChange={handleChange} className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" type="text" placeholder="Date" required />
            <input name="description" value={formData.description} onChange={handleChange} className="w-full border mt-1 bg-indigo-500/5 mb-2 border-gray-500/10 outline-none rounded py-2.5 px-3" type="text" placeholder="Description" required />
            <input name="category" value={formData.category} onChange={handleChange} className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3" type="text" placeholder="Category" required />
            <div className="flex items-center mb-7">
                <input id="income-checkbox" name="is_income" checked={formData.is_income} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" type="checkbox" />
                <label htmlFor="income-checkbox" className="ml-2 block text-sm text-gray-900">
                    Income
                </label>
            </div>
            <input name="amount" value={formData.amount} onChange={handleChange} className="w-full border mt-1 bg-indigo-500/5 mb-7 border-gray-500/10 outline-none rounded py-2.5 px-3" type="number" placeholder="Amount₹" required />

            <button type="submit" className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium">{transaction ? "Update" : "Add"}</button>
        </form>
    );
}

export default TransactionFrom
