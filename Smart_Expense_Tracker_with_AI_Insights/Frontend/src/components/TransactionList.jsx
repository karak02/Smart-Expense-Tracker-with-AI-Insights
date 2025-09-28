import React,{useState,useEffect} from 'react'
import TransactionForm from './TransactionFrom';

const TransactionList = () => {

const [transactions,setTransactions]=useState([])
const [edit,setEdit]= useState(null);
const [showForm,setShowForm]=useState(false);

useEffect(()=>{
  //fetch transactions from backend
  const fetchTramsactions = async () =>{
    try{
      const response = await fetch("http://localhost:8000/api/transactions/"); // FastAPI endpoint
      const data = await response.json();
      setTransactions(data);  // store in state
    }catch(error){
      console.error("Error fetching transactions:",error);
    }
  };
  fetchTramsactions();
},[])


const handeldelete = async(id)=>{
        try{
            const res = await fetch(`http://localhost:8000/api/transactions/${id}`,{
                method:"DELETE",
            })
            if(!res.ok){
                throw new Error("Failed to delete")
            }

            //remove from ui
              setTransactions(transactions.filter((t)=>t.id !== id));
        }catch{
          alert("Something went wrong while deleting");
        }
    }


const handleFormSuccess = (save) =>{
  setTransactions((prev)=>{
    const exits = prev.some((t)=>t.id === save.id);
    if(exits){
      return prev.map((t)=>(t.id === save.id ? save : t));
    }else{
      return [save,...prev];
    }
  });
  setShowForm(false); // Hide the form after success
  setEdit(null); // Clear edit state
}


  return (
    <div className="bg-gray-900 p-4 sm:p-6 lg:p-8">
         {/* <button
        onClick={() => {
          setEdit(null);
          setShowForm(true);
        }}
        className="mb-4 bg-green-600 px-4 py-2 text-white rounded"
      >
        + Add Transaction
      </button> */}

      {showForm && (
        <TransactionForm
          transaction={edit}
          onSuccess={handleFormSuccess}
          onCancel={() => {
            setShowForm(false);
            setEdit(null);
          }}
        />
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-700">
          <thead className="ltr:text-left rtl:text-right">
            <tr>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-white">Date</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-white">Description</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-white">Category</th>
              <th className="whitespace-nowrap px-4 py-2 font-medium text-white">Amount</th>
               <th className="whitespace-nowrap px-4 py-2 font-medium text-white">Actions</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-500  bg-gray-800 items-center justify-center gap-1">
            {transactions.map((tx)=>( 
            <tr key = {tx.id}>
              <td className="whitespace-nowrap px-4 py-2 font-medium text-white">{tx.date || "N/A"}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-300">{tx.description || "N/A"}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-300">{tx.category || "N/A"}</td>
              <td className="whitespace-nowrap px-4 py-2 text-gray-300">{tx.amount || "N/A"}</td>
              <td className="whitespace-nowrap px-4 py-2 space-x-2">
                <button onClick={()=>{setEdit(tx); setShowForm(true)}} className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                  Update
                </button>
                <button onClick={()=>handeldelete(tx.id)} className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                  Delete
                </button>
              </td>
            </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

  )
}

export default TransactionList
