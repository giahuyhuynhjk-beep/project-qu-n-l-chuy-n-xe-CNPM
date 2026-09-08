import React from 'react';
import { Layout, Calendar, Activity, RefreshCcw, Car, MapPin } from 'lucide-react';
import Footer from '../../components/shared/foooter.jsx';
import DatePickerComponent from '../../components/shared/DatePickerComponent.jsx';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header / Navigation */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div className="flex items-center gap-2">
          <div className="bg-cyan-100 p-2 rounded-lg">
            <Layout className="text-cyan-600 w-6 h-6" />
          </div>
          <span className="font-bold text-xl text-slate-800">GROUP 2-CNPM </span>
        </div>
        
        <div className="flex gap-8 text-slate-600 font-medium">
          <a href="#" className="hover:text-cyan-600">Trang chủ</a>
          <a href="#" className="hover:text-cyan-600">Tra cứu chuyến xe</a>
          <a href="#" className="border-b-2 border-cyan-500 text-cyan-600 pb-1">Lịch chạy xe</a>
        </div>

        <button className="flex items-center gap-2 px-4 py-2 border rounded-full hover:bg-slate-50">
          <div className="w-6 h-6 bg-cyan-100 rounded-full flex items-center justify-center text-xs">👤</div>
          <span className="text-sm font-medium">Tài xế</span>
        </button>
      </nav>

      {/* Hero Section (Hero Dark) */}
      <div className="bg-[#0a1128] text-white pt-16 pb-32 px-12 relative overflow-hidden">
        {/* Decorative lines (mô phỏng đường kẻ trong ảnh) */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full border-t border-dashed border-cyan-400 rotate-12 transform scale-150"></div>
          <div className="absolute top-0 left-0 w-full h-full border-t border-dashed border-cyan-400 -rotate-12 transform scale-150"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold mb-2">Trung tâm điều hành cá nhân</h1>
          <p className="text-slate-400 text-lg mb-12">Quản lý lộ trình và giám sát chuyến xe trực tuyến</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Tổng quan */}
            <div className="bg-[#1a233a] p-8 rounded-3xl border border-slate-700">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Layout className="w-4 h-4" /> TỔNG QUAN
              </div>
              <h2 className="text-2xl font-bold mb-4">Xin chào, Lê Thị B</h2> {/* data base? */}
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-4 h-4" /> 25/04/2026
              </div>
            </div>

            {/* Card 2: Chuyến sắp tới */}
            <div className="bg-[#1a233a] p-8 rounded-3xl border-2 border-cyan-500 relative overflow-hidden">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <div className="w-2 h-2 bg-cyan-400 rounded-full"></div> CHUYẾN SẮP TỚI
              </div>
              <div className="flex flex-col items-center justify-center py-4">
                <div className="w-8 h-8 border-2 border-slate-500 rounded-full flex items-center justify-center mb-4">
                  <div className="w-4 h-4 bg-cyan-400 rounded-full opacity-20 animate-ping absolute"></div>
                  <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                </div>
                <p className="text-slate-400 text-sm">Không có chuyến xe nào sắp tới</p>
              </div>
              {/* Icon map mờ bên phải */}
              <div className="absolute right-[-20px] bottom-4 opacity-20">
                <MapPin className="w-24 h-24 text-cyan-400" />
              </div>
            </div>

            {/* Card 3: Hiệu suất */}
            <div className="bg-[#1a233a] p-8 rounded-3xl border border-slate-700">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Activity className="w-4 h-4" /> HIỆU SUẤT
              </div>
              <div className="text-5xl font-bold text-cyan-400 mb-2">153</div>
              <p className="text-slate-400 text-sm">Chuyến đã hoàn thành</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-12 -mt-12 relative z-20">
        {/* Filters and Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-2">
            <button className="px-6 py-2 bg-white border rounded-xl shadow-sm font-medium">Hôm nay</button>
            <button className="px-6 py-2 bg-white border rounded-xl shadow-sm text-slate-500">Ngày mai</button>
            <DatePickerComponent />
          </div>

          <div className="bg-slate-200 p-1 rounded-xl flex gap-1">
            <button className="px-6 py-1.5 bg-white rounded-lg shadow-sm font-medium">Tất cả</button>
            <button className="px-4 py-1.5 text-slate-500 hover:bg-white/50 rounded-lg">Chờ xác nhận</button>
            <button className="px-4 py-1.5 text-slate-500 hover:bg-white/50 rounded-lg">Sắp khởi hành</button>
            <button className="px-4 py-1.5 text-slate-500 hover:bg-white/50 rounded-lg">Đang chạy</button>
          </div>

          <button className="flex items-center gap-2 px-6 py-2 bg-[#1e293b] text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
            <RefreshCcw className="w-4 h-4" />
            Cập nhật hệ thống
          </button>
        </div>

        {/* Empty State Area (Ảnh thứ 2 của bạn) */}
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-24">
          <div className="flex items-center gap-2 text-slate-800 font-bold mb-8">
             <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
             CHUYẾN XE ĐANG HOẠT ĐỘNG & SẮP TỚI
          </div>
          
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Car className="w-12 h-12 mb-4 opacity-30" />
            <p>Không có chuyến xe nào đang hoạt động trong bộ lọc hiện tại</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;