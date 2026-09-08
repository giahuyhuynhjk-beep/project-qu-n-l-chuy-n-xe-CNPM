import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  Download,
  Eye,
  Filter,
  RefreshCw,
  Search,
  Ticket,
  WalletCards,
  X,
} from "lucide-react";
import { AdminPage, StatCard, StatusPill } from "../../layouts/AdminLayout";
import { bookings as seedBookings } from "../../data/adminMockData";

const bookingRows = [
  ...seedBookings,
  { code: "TK-786-RESET", passenger: "Trần Minh K", trip: "TP. Hồ Chí Minh - Cần Thơ", seat: "G11", status: "Đã xác nhận", payment: "Đã xác nhận", date: "2026-05-05", channel: "Quầy vé" },
  { code: "TK-590-VIP", passenger: "Phan Anh Ngọc", trip: "Đà Nẵng - Huế", seat: "A02", status: "Chờ thanh toán", payment: "Chờ xử lý", date: "2026-05-06", channel: "Online" },
  { code: "TK-100-PAID", passenger: "Hoài Nam", trip: "Hà Nội - Sa Pa", seat: "B04", status: "Hoàn thành", payment: "Đã xác nhận", date: "2026-05-07", channel: "Khách đặt" },
  { code: "TK-687-CANCELLED", passenger: "Nguyễn Vân A", trip: "Sài Gòn đi Phú Quốc", seat: "A18", status: "Bị hủy", payment: "Đã hoàn tiền", date: "2026-05-08", channel: "Khách đặt" },
].map((item, index) => ({
  date: item.date || `2026-05-${String(index + 2).padStart(2, "0")}`,
  channel: item.channel || "Khách đặt",
  price: item.price || ["200.000đ", "300.000đ", "350.000đ", "150.000đ", "420.000đ"][index % 5],
  ...item,
}));

function TicketStatus({ status }) {
  if (status === "Đã xác nhận" || status === "Hoàn thành") return <StatusPill status="Đã xác nhận" />;
  if (status === "Bị hủy") return <StatusPill status="Bị hủy" />;
  return <StatusPill status="Chờ thanh toán" />;
}

function PaymentStatus({ payment }) {
  if (payment === "Đã xác nhận") return <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">Đã xác nhận</span>;
  if (payment === "Đã hoàn tiền") return <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-black text-slate-600">Đã hoàn tiền</span>;
  return <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-black text-amber-700">Chờ xử lý</span>;
}

export default function BookingManagementAdmin() {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [date, setDate] = useState("");
  const [detailBooking, setDetailBooking] = useState(null);

  const filtered = useMemo(() => {
    return bookingRows.filter((item) => {
      const haystack = [item.code, item.passenger, item.trip, item.seat, item.status, item.payment].join(" ").toLowerCase();
      const matchKeyword = haystack.includes(keyword.toLowerCase());
      const matchStatus = status === "all" || item.status === status || item.payment === status;
      const matchDate = !date || item.date === date;
      return matchKeyword && matchStatus && matchDate;
    });
  }, [keyword, status, date]);

  const resetFilters = () => {
    setKeyword("");
    setStatus("all");
    setDate("");
  };

  return (
    <AdminPage
      title="Quản lý đặt vé"
      subtitle="Điều hành và kiểm soát luồng vé thời gian thực."
      actionLabel="+ Tạo vé mới"
      onAction={() => alert("Mở form tạo vé mới. Chưa kết nối backend.")}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard icon={ClipboardList} label="Chờ xử lý" value={bookingRows.filter((b) => b.status.includes("Chờ") || b.payment.includes("Chờ")).length} hint="Cần kiểm tra trong ngày" />
        <StatCard icon={Ticket} label="Đã xác nhận" value={bookingRows.filter((b) => b.status === "Đã xác nhận" || b.status === "Hoàn thành").length} tone="emerald" hint="Vé đã đủ điều kiện khởi hành" />
        <StatCard icon={WalletCards} label="Tỉ lệ lấp đầy" value="95%" tone="slate" hint="Theo dữ liệu đặt vé hiện tại" />
      </div>

      <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-sm font-black text-slate-800">Tra cứu giao dịch</h2>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50"><Download size={14} /> Xuất dữ liệu</button>
            <button onClick={resetFilters} className="inline-flex items-center gap-2 rounded-xl border border-blue-200 px-3 py-2 text-xs font-black text-blue-700 hover:bg-blue-50"><RefreshCw size={14} /> Làm mới</button>
          </div>
        </div>
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_170px_120px]">
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Nhập mã vé, tên hành khách..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <label className="relative">
            <CalendarDays size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white">
            <option value="all">Tất cả trạng thái</option>
            <option>Chờ thanh toán</option>
            <option>Đã xác nhận</option>
            <option>Hoàn thành</option>
            <option>Bị hủy</option>
          </select>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-black text-white shadow-sm hover:bg-blue-700"><Filter size={15}/> Lọc dữ liệu</button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">Mã vé</th>
                <th className="px-4 py-3">Thông tin chuyến</th>
                <th className="px-4 py-3">Vị trí</th>
                <th className="px-4 py-3">Hành khách</th>
                <th className="px-4 py-3">Nguồn</th>
                <th className="px-4 py-3">Giá tiền</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3">Thanh toán</th>
                <th className="px-4 py-3 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((booking) => (
                <tr key={booking.code} className="text-sm hover:bg-blue-50/50">
                  <td className="px-4 py-4 font-black text-blue-700">{booking.code}</td>
                  <td className="px-4 py-4"><p className="font-bold text-slate-900">{booking.trip}</p><p className="mt-1 text-xs font-semibold text-slate-400">Khởi hành: {booking.date}</p></td>
                  <td className="px-4 py-4"><span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-black text-slate-700">Ghế {booking.seat}</span></td>
                  <td className="px-4 py-4 font-bold text-slate-700">{booking.passenger}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">{booking.channel}</span></td>
                  <td className="px-4 py-4 font-black text-slate-800">{booking.price}</td>
                  <td className="px-4 py-4"><TicketStatus status={booking.status} /></td>
                  <td className="px-4 py-4"><PaymentStatus payment={booking.payment} /></td>
                  <td className="px-4 py-4 text-right">
                    <button onClick={() => setDetailBooking(booking)} className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-50">
                      <Eye size={15} /> Xem
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 text-xs font-bold text-slate-500">
          <span>Hiển thị {filtered.length} vé trên tổng số {bookingRows.length}</span>
          <div className="flex items-center gap-3"><button className="rounded-lg border border-slate-200 p-2 text-slate-400"><ChevronLeft size={16}/></button><span className="text-slate-800">Trang 1 / 1</span><button className="rounded-lg border border-slate-200 p-2 text-slate-400"><ChevronRight size={16}/></button></div>
        </div>
      </div>

      {detailBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">CHI TIẾT VÉ</span>
                <h2 className="mt-3 text-2xl font-black text-slate-900">{detailBooking.code}</h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">Thông tin hành khách, chuyến đi và thanh toán.</p>
              </div>
              <button onClick={() => setDetailBooking(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
            </div>

            <div className="grid gap-4 p-6 md:grid-cols-2">
              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="mb-4 text-sm font-black text-slate-800">Thông tin hành khách</p>
                <div className="space-y-3 text-sm">
                  <div><p className="text-xs font-bold text-slate-400">Hành khách</p><p className="font-black text-slate-900">{detailBooking.passenger}</p></div>
                  <div><p className="text-xs font-bold text-slate-400">Vị trí</p><p className="font-black text-slate-900">Ghế {detailBooking.seat}</p></div>
                  <div><p className="text-xs font-bold text-slate-400">Nguồn đặt</p><p className="font-black text-slate-900">{detailBooking.channel}</p></div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="mb-4 text-sm font-black text-slate-800">Thông tin chuyến đi</p>
                <div className="space-y-3 text-sm">
                  <div><p className="text-xs font-bold text-slate-400">Tuyến</p><p className="font-black text-slate-900">{detailBooking.trip}</p></div>
                  <div><p className="text-xs font-bold text-slate-400">Ngày khởi hành</p><p className="font-black text-slate-900">{detailBooking.date}</p></div>
                  <div><p className="text-xs font-bold text-slate-400">Trạng thái vé</p><TicketStatus status={detailBooking.status} /></div>
                </div>
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 md:col-span-2">
                <p className="mb-4 text-sm font-black text-slate-800">Thanh toán</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">Giá vé</p><p className="text-lg font-black text-blue-700">{detailBooking.price}</p></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">Trạng thái thanh toán</p><div className="mt-1"><PaymentStatus payment={detailBooking.payment} /></div></div>
                  <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold text-slate-400">Mã giao dịch</p><p className="font-black text-slate-800">PAY-{detailBooking.code.replace("TK-", "")}</p></div>
                </div>
              </section>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={() => setDetailBooking(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50">Đóng</button>
              <button className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700">Xác nhận xử lý</button>
            </div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
