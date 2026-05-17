import { useCallback, useEffect, useState } from "react";
import {toast} from "react-hot-toast";
import Loading from '../components/Loading';
import CheckinButton from "../components/attendance/CheckinButton";
import AttendanceStat from "../components/attendance/AttendanceStat";
import AttendanceHistory from "../components/attendance/AttendanceHistory";
import api from "../api/axios";

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true);
  const [isDeleted, setIsDeleted] = useState(false);

  const fetchData = useCallback(async()=> {
    try {
      const response = await api.get('/attendance');
      const json = response.data;
      setHistory(json.data || [])
      if(json.employee?.isDeleted) setIsDeleted(true)
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message);
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(()=>{
    fetchData()
  }, [fetchData])

  if(loading) return <Loading />

  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRecord = history.find((r)=> new Date(r.date).toDateString() === today.toDateString())

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">Attendance</h2>
        <p className="page-subtitle">Track your work hours and your daily check-ins</p>
      </div>

      {isDeleted ? (
        <div className="mb-8 p-6 bg-rose-50 border border-rose-200 rounded-2xl text-center">
          <p className="text-rose-600">You can no longer clock in or out because your employee records has been marked as deleted</p>
        </div>
      ) : (
        <div className="mb-8">
          <CheckinButton todayRecord={todayRecord} onAction={fetchData} />
        </div>
      )}

      <AttendanceStat history={history} />
      <AttendanceHistory history={history} />
    </div>
  )
}

export default Attendance
