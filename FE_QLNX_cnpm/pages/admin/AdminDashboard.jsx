import React from "react";
import { AlertTriangle, ArrowRight, CheckCircle2, Clock3 } from "lucide-react";
import { AdminPage, StatCard, StatusPill } from "../../layouts/AdminLayout";
import { bookings, reportRows, trips } from "../../data/adminMockData";

export default function AdminDashboard({ onChangePage }) {
  return (
    <AdminPage title="Dashboard quản trị" subtitle="Tổng quan vận hành nhà xe theo thời gian thực.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng chuyến" value={trips.length} hint="Chuyến đang quản lý" />
        <StatCard label="Đơn đặt vé" value={bookings.length} hint="Bao gồm vé chờ xử lý" tone="amber" />
        <StatCard label="Doanh thu mẫu" value="5.750.000đ" hint="Mock data cho demo" tone="emerald" />
        <StatCard label="Cảnh báo" value="2" hint="Thiếu xe/tài xế, chậm chuyến" tone="rose" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900">Chuyến cần chú ý</h2>
              <p className="text-sm text-slate-500">Theo dõi nhanh các chuyến thiếu nguồn lực.</p>
            </div>
            <button onClick={() => onChangePage("trips")} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50">
              Xem chuyến <ArrowRight size={15} />
            </button>
          </div>
          <div className="space-y-3">
            {trips.slice(0, 3).map((trip) => (
              <div key={trip.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div>
                  <p className="font-black text-slate-900">{trip.route}</p>
                  <p className="mt-1 text-sm text-slate-500">{trip.id} · {trip.date} · {trip.time}</p>
                </div>
                <StatusPill status={trip.status} />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Trung tâm cảnh báo</h2>
          <div className="mt-4 space-y-3">
            <div className="flex gap-3 rounded-2xl bg-amber-50 p-4 text-amber-700">
              <Clock3 size={20} />
              <div><p className="font-black">1 chuyến chờ phân công</p><p className="text-sm">Cần gắn tài xế hoặc phương tiện.</p></div>
            </div>
            <div className="flex gap-3 rounded-2xl bg-rose-50 p-4 text-rose-700">
              <AlertTriangle size={20} />
              <div><p className="font-black">1 phương tiện bảo trì</p><p className="text-sm">Kiểm tra trước khi điều phối.</p></div>
            </div>
            <div className="flex gap-3 rounded-2xl bg-emerald-50 p-4 text-emerald-700">
              <CheckCircle2 size={20} />
              <div><p className="font-black">Thanh toán ổn định</p><p className="text-sm">Các giao dịch đã xác nhận.</p></div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-black text-slate-900">Chi tiết vận hành gần đây</h2>
        <div className="mt-4 grid gap-3">
          {reportRows.map((row) => (
            <div key={row.trip} className="grid gap-3 rounded-xl border border-slate-100 p-4 text-sm md:grid-cols-[120px_1fr_140px_90px] md:items-center">
              <span className="font-bold text-slate-500">{row.date}</span>
              <span className="font-black text-blue-700">{row.trip} · {row.route}</span>
              <span className="font-bold text-slate-700">{row.revenue}</span>
              <StatusPill status={row.status} />
            </div>
          ))}
        </div>
      </section>
    </AdminPage>
  );
}
