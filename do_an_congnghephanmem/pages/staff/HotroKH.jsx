import React, { useState } from 'react';
import "./HotroKH.css";

import { 
  Bus, 
  Users, 
  Ticket, 
  CreditCard, 
  Search, 
  Filter, 
  ChevronDown, 
  MessageSquare, 
  Plus, 
  Send, 
  Paperclip, 
  UserCircle, 
  Clock
} from 'lucide-react';

const App = () => {
  const tickets = [
    {
      id: '#TCK-20231025-008',
      title: 'Tài khoản khách hàng bị khoá tạm thời',
      source: 'HỆ THỐNG',
      customer: 'Khách vãng lai',
      status: 'Mới (OPEN)',
      time: '12:53:54 28/4/2026',
      active: true
    },
    {
      id: '#TCK-20231023-007',
      title: 'Câu hỏi về hành lý xách tay',
      source: 'KHÁCH HÀNG',
      customer: 'Mai Tiến Đạt • 0989990001',
      status: 'Mới (OPEN)',
      time: '12:53:54 27/4/2026'
    },
    {
      id: '#TCK-20231022-006',
      title: 'Cập nhật thông tin hoá đơn điện tử',
      source: 'NHÂN VIÊN',
      customer: 'Đoàn Thu Hiền • 0978889990',
      status: 'Mới (OPEN)',
      time: '12:53:54 26/4/2026'
    },
    {
      id: '#TCK-20231020-005',
      title: 'Khách hàng muốn huỷ vé đã mua',
      source: 'CHATBOT',
      customer: 'Lâm Quốc Bảo • 0967778889',
      status: 'Đang xử lý',
      time: '12:53:54 25/4/2026'
    }
  ];

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      {/* Main Content Area - Full Width */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
               <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white md:hidden">
                  <Bus size={14} />
               </div>
               <h2 className="text-xl font-bold text-slate-900">Hỗ trợ khách hàng</h2>
            </div>
            <p className="text-xs text-slate-400">Quản lý và giải quyết các yêu cầu hỗ trợ vận hành</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ĐANG MỞ</span>
                <span className="text-xl font-bold text-orange-500 leading-none">12</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ĐANG XỬ LÝ</span>
                <span className="text-xl font-bold text-blue-600 leading-none">08</span>
              </div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all active:scale-95">
              <Plus size={18} />
              Tạo yêu cầu mới
            </button>
          </div>
        </header>

        {/* Workplace Grid */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Panel: Ticket List */}
          <div className="w-80 border-r border-slate-200 bg-white flex flex-col flex-shrink-0">
            <div className="p-4 space-y-3 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Mã vé, tên KH, SĐT..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
                {['Tất cả', 'Mới', 'Xử lý', 'Xong'].map((filter, i) => (
                  <button key={filter} className={`flex-1 py-1 text-xs font-semibold rounded-md transition-all ${i === 0 ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}>
                    {filter}
                  </button>
                ))}
              </div>
              <button className="w-full flex items-center justify-between px-3 py-1.5 border border-slate-200 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-2">
                  <Filter size={14} />
                  Tất cả nguồn
                </div>
                <ChevronDown size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50">
              {tickets.map((ticket) => (
                <div 
                  key={ticket.id} 
                  className={`p-4 border-b border-slate-200 cursor-pointer transition-all ${ticket.active ? 'bg-white ring-2 ring-inset ring-blue-500 ring-opacity-10' : 'hover:bg-slate-100'}`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">{ticket.id}</span>
                    <span className="text-[9px] font-bold text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded">{ticket.source}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 line-clamp-1 mb-1">{ticket.title}</h4>
                  <p className="text-xs text-slate-500 mb-2">{ticket.customer}</p>
                  <div className="flex justify-between items-center">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${ticket.id.includes('005') ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-600'}`}>
                      {ticket.status}
                    </span>
                    <div className="flex items-center gap-1 text-slate-400 text-[10px]">
                      <Clock size={10} />
                      {ticket.time.split(' ')[0]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Center Panel: Conversation */}
          <div className="flex-1 flex flex-col bg-white">
            <div className="p-5 border-b border-slate-100 flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                  <MessageSquare size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">Tài khoản khách hàng bị khoá tạm thời</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">MỚI (OPEN)</span>
                    <span className="text-xs text-slate-400">• Nguồn: Hệ thống</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all active:scale-95">Tiếp nhận xử lý</button>
                <button className="bg-white border border-red-200 text-red-500 px-4 py-2 rounded-lg text-sm font-bold hover:bg-red-50 transition-all active:scale-95">Đóng yêu cầu</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {/* Messages */}
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    [HỆ THỐNG] PHÁT HIỆN TÀI KHOẢN CUSTOMER_THAO ĐĂNG NHẬP SAI MẬT KHẨU 5 LẦN LIÊN TIẾP TỪ IP 113.160.X.X. TÀI KHOẢN ĐÃ BỊ KHOÁ TẠM THỜI ĐỂ BẢO MẬT. • 12:53:54 28/4/2026
                  </p>
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    [HỆ THỐNG] EMAIL CẢNH BÁO BẢO MẬT ĐÃ ĐƯỢC GỬI ĐẾN ĐỊA CHỈ ĐĂNG KÝ CỦA TÀI KHOẢN CUSTOMER_THAO. YÊU CẦU XÁC THỰC QUA LINK ĐỂ MỞ KHÓA. • 12:58:54 28/4/2026
                  </p>
                </div>
              </div>
            </div>

            {/* Input area */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="max-w-4xl mx-auto border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all shadow-sm">
                <textarea 
                  className="w-full p-4 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none min-h-[100px] resize-none"
                  placeholder="Nhập nội dung phản hồi khách hàng..."
                />
                <div className="bg-slate-50 p-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-3 ml-2">
                    <button className="text-slate-500 hover:text-blue-600 flex items-center gap-1.5 text-xs font-medium">
                      <Plus size={14} className="border border-slate-400 rounded-full p-0.5" />
                      Thêm mẫu câu
                    </button>
                    <button className="text-slate-500 hover:text-blue-600 flex items-center gap-1.5 text-xs font-medium">
                      <Paperclip size={14} />
                      Đính kèm ảnh
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-200 rounded-lg transition-colors">Gửi & Đóng</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-500/20 transition-all">
                      Gửi
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Details */}
          <div className="w-80 border-l border-slate-200 bg-white overflow-y-auto p-5 space-y-6 flex-shrink-0">
            {/* Assigned Section */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                <UserCircle size={14} />
                PHỤ TRÁCH
              </div>
              <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3 border border-dashed border-slate-300">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-400">?</div>
                <div>
                  <h5 className="text-sm font-bold text-slate-800">Chưa phân công</h5>
                  <p className="text-[10px] text-slate-400 font-medium">NHÂN VIÊN XỬ LÝ</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block tracking-wider">CHUYỂN GIAO CHO</label>
                <div className="relative">
                  <select className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>Chọn nhân viên...</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                </div>
              </div>
            </section>

            {/* Customer Section */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                <Users size={14} />
                KHÁCH HÀNG
              </div>
              <div className="text-center py-12 border border-slate-100 rounded-xl bg-slate-50/50">
                <p className="text-sm text-slate-400 italic">Hồ sơ khách vãng lai</p>
              </div>
            </section>

            {/* Linked Transaction */}
            <section>
              <div className="flex items-center gap-2 mb-4 text-slate-400 uppercase tracking-widest text-[10px] font-bold">
                <CreditCard size={14} />
                GIAO DỊCH LIÊN KẾT
              </div>
              <div className="bg-slate-900 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="text-white/20 mb-3">
                  <CreditCard size={32} />
                </div>
                <p className="text-xs text-white/40 italic">Không tìm thấy giao dịch</p>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;