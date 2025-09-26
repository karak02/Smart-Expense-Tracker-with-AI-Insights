import './App.css';
import React,{useEffect,useState} from 'react';
import api from './api';


const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [formData,setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });

  const fetchTransactions = async () => {
    const response = await api.get('/transactions/');
    setTransactions(response.data);
  };
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleInputChange=(e)=>{
    const value = e.target.type === 'checkbox'
? e.target.checked : e.target.value ;
setFormData({
  ...formData,
  [e.target.name]:value,
  });
};

const handleFormSubmit=async(e)=>{
  e.preventDefault();
  await api.post('/transactions/',formData);
  fetchTransactions();
  setFormData({
    amount: '',
    category: '',
    description: '',
    is_income: false,
    date: ''
  });
};

  return (
    <div className="App">
      <h1>Transaction App</h1>

      <form onSubmit={handleFormSubmit}>
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <label>
          Is Income:
          <input
            type="checkbox"
            name="is_income"
            checked={formData.is_income}
            onChange={handleInputChange}
          />
        </label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
        />
        <button type="submit">Submit</button>
      </form>

      <div>
        
      </div>
    </div>
  );
} // Closing brace for App component

export default App;
