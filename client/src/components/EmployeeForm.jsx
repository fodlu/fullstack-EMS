import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS } from '../assets/assets';
import { Loader2Icon } from 'lucide-react';

const EmployeeForm = ({initialData, onSuccess, onCancel}) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const isEditMode = !!initialData;
    const handleSubmit = async(e) => {
        e.preventDefault();
    }
  return (
    <form onSubmit={handleSubmit} className='space-y-6 max-w-3xl animate-fade-in'>

        {/* Personal information */}
        <div className="card p-5 sm:p-6">
            <h3 className='font-medium mb-6 pb-4 border-b border-slate-100 '>Personal information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                <div>
                    <label className='block mb-2' htmlFor="firstname">First Name</label>
                    <input type="text" name='firstName' id='firstname' required defaultValue={initialData?.firstName} />
                </div>
                <div>
                    <label className='block mb-2' htmlFor="lastname">Last Name</label>
                    <input type="text" name='lastName' id='lastname' required defaultValue={initialData?.lastName} />
                </div>
                <div>
                    <label className='block mb-2' htmlFor="phone">Phone Number</label>
                    <input type="text" name='phone' id='phone' required defaultValue={initialData?.phone} />
                </div>
                <div>
                    <label className='block mb-2' htmlFor="joindate">Join Date</label>
                    <input type="date" name='joinDate' id='joindate' required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0] : ''} />
                </div>
                <div className='sm:col-span-2'>
                    <label className='block mb-2' htmlFor="bio">Bio (Optional)</label>
                    <textarea name='bio' id='bio' defaultValue={initialData?.bio} rows={3} className='resize-none' placeholder='Brief description...' />
                </div>
            </div>
        </div>

        {/* Epmloyment details */}

        <div className="card p-5 sm:p-6">
            <h3 className='font-medium mb-6 pb-4 border-b border-slate-100 '>Employment Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                <div className="">
                    <label htmlFor="dept" className='block mb-2'>Department</label>
                    <select name="department" defaultValue={initialData?.deparment || ''}>
                        <option value="">Select Department</option>
                        {DEPARTMENTS.map((depName)=>(
                            <option value={depName} key={depName}>{depName}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className='block mb-2' htmlFor="position">Position</label>
                    <input type="text" name='position' id='position' required defaultValue={initialData?.position} />
                </div>
                <div>
                    <label className='block mb-2' htmlFor="basicSalary">Basic Salary</label>
                    <input type="number" name='basicSalary' id='basicSalary' required min={0} step={0.01} defaultValue={initialData?.basicSalary || 0} />
                </div>
                <div>
                    <label className='block mb-2' htmlFor="allowance">Allowances</label>
                    <input type="number" name='allowances' id='allowance' required defaultValue={initialData?.allowances || 0} min={0} step={0.01} />
                </div>
                <div>
                    <label className='block mb-2' htmlFor="deduction">Deductions</label>
                    <input type="number" name='deductions' id='deduction' required defaultValue={initialData?.deductions || 0} min={0} step={0.01} />
                </div>
                {isEditMode && (
                    <div>
                        <label className='block mb-2' htmlFor="status">Status</label>
                        <select name='employmentsStatus' id='status' required defaultValue={initialData?.employmentsStatus || 0}>
                            <option value="ACTIVE">Active</option>
                            <option value="INACTIVE">Inactive</option>
                        </select>
                    </div>
                )}
            </div>
        </div>

        {/* Account setup */}
        <div className="card p-5 sm:p-6">
            <h3 className='text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100'>Account Setup</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                <div className='sm:col-span-2'>
                    <label className='block mb-2' htmlFor="workemail">Work Email</label>
                    <input type="email" name='email' id='workemail' required defaultValue={initialData?.emial} />
                </div>
                {!isEditMode && (
                    <div>
                        <label className='block mb-2' htmlFor="password">Temporary Password</label>
                        <input type="password" name='password' id='password' required />
                    </div>
                )}
                {isEditMode && (
                    <div>
                        <label className='block mb-2' htmlFor="password">Change Password (Optional)</label>
                        <input type="password" name='password' id='password' placeholder='Leave a blank to keep current' />
                    </div>
                )}
                <div>
                    <label className='block mb-2' htmlFor="role">System Role</label>
                    <select name='role' id='role' defaultValue={initialData?.role || "EMPLOYEE"}>
                        <option value="EMPLOYEE">Employee</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                </div>
            </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
            <button onClick={()=>(onCancel ? onCancel() : navigate(-1))} type='button' className="btn-secondary">
                Cancel
            </button>
            <button type='submit' disabled={loading} className="btn-primary flex items-center justify-center">
                {loading && <Loader2Icon className='w-4 h-4 mr-2 animate-spin' />}
                {isEditMode ? "Update Employee" : "Create Employee"}
            </button>
        </div>
    </form>
  )
}

export default EmployeeForm