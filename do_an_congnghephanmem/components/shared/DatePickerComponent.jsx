import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Calendar } from 'lucide-react';
import "react-datepicker/dist/react-datepicker.css";

const DatePickerComponent = () => {
  const [startDate, setStartDate] = useState(new Date());

  return (
    <div className="relative group">
      <Calendar className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 z-10 pointer-events-none" />
      
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        dateFormat="dd/MM/yyyy"
        className="pl-11 pr-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm w-44 
                   focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent
                   cursor-pointer text-slate-600 font-medium"
        placeholderText="Chọn ngày"
      />

      <style>{`
        .react-datepicker {
          border-radius: 1rem;
          border: none;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          font-family: inherit;
          padding: 8px;
        }
        .react-datepicker__header {
          background-color: white;
          border-bottom: none;
        }
        .react-datepicker__day--selected {
          background-color: #06b6d4 !important;
          border-radius: 0.5rem;
        }
        .react-datepicker__day:hover {
          border-radius: 0.5rem;
        }
      `}</style>
    </div>
  );
};

export default DatePickerComponent;
