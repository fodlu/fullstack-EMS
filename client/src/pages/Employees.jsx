import { useCallback, useEffect, useState } from "react";
import { DEPARTMENTS } from '../assets/assets'
import { Plus, Search, X} from 'lucide-react'
import EmployeeCard from "../components/EmployeeCard";
import EmployeeForm from "../components/EmployeeForm";
import api from "../api/axios";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('')
  const [editEmployee, setEditEmployee] = useState(null);
  const [showCreateModel, setShowCreateModel] = useState(false)

  const fetchEmployee = useCallback(async ()=> {
    try {
      const url = selectedDept ? `/employee?department=${selectedDept}` : '/employees'
      const res = await api.get(url)
      setEmployees(res.data)
    } catch {
      console.error("Failed to fetch employee")
    } finally {
      setLoading(false);
    }
  }, [selectedDept]);

  useEffect(()=> {
    fetchEmployee()
  }, [fetchEmployee])

  const filtered = employees.filter((emp)=> `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3">
        <div className="">
          <h1 className="page-title">Employees</h1>
          <p className="page-subtitle">Manage your team members</p>
        </div>
        <button onClick={()=> setShowCreateModel(true)} className="btn-primary flex items-center gap-2
         w-full sm:w-auto justify-center">
          <Plus size={16} /> Add Employee
        </button>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input type="text" placeholder="Search Employees..." className="w-full pl-10!" onChange={(e)=> setSearch(e.target.value)} value={search} />
        </div>
        <select value={selectedDept} onChange={(e)=> setSelectedDept(e.target.value)} className="max-w-40">
          <option value=''>All Department</option>
          {DEPARTMENTS.map((detpName)=>(
            <option key={detpName} value={detpName}>{detpName}</option>
          ))}
        </select>
      </div>


      {/* Employee cards */}
      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filtered.length === 0 ? (
            <p className="col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200">No employees found</p>
          ) : (
            filtered.map((emp)=> (<EmployeeCard key={emp.id} onDelete={fetchEmployee} onEdit={(e)=> setEditEmployee(e)} employee={emp} />))
          )}
        </div>
      )}

      {/* Create Employee Model */}
      {showCreateModel && (
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={()=> setShowCreateModel(false)}>
          <div className="fixed inset-0" />

          <div className="relative bg-white rounded-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e)=> e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div className="">
                <h2 className="text-lg font-semibold text-slate-900">Add New Employee</h2>
                <p className="text-sm text-slate-500 mt-0.5">Create a new user account and employee profile</p>
              </div>
              <button onClick={()=> setShowCreateModel(false)} className="p2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <EmployeeForm onSuccess = {()=> {
                setShowCreateModel(false);
                fetchEmployee();
              }} onCancel={()=> setShowCreateModel(false)} />
            </div>

          </div>
        </div>
      )}


      {/* Edit Employee Model */}

      {editEmployee && (
        <div className="fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto"
        onClick={()=>setEditEmployee(null)}>

          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in" onClick={(e)=> e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 pb-0">
              <div className="">
                <h2 className="text-lg font-semibold text-slate-900">Edit Employee</h2>
                <p className="text-sm text-slate-500 mt-0.5">Update employee details</p>
              </div>
              <button onClick={()=> setEditEmployee(null)} className="p2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <EmployeeForm initialData = {editEmployee} onSuccess = {()=> {
                setEditEmployee(null);
                fetchEmployee();
              }} onCancel={()=> setEditEmployee(null)} />
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default Employees
