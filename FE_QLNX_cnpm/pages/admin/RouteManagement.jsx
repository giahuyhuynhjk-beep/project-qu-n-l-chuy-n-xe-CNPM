import React, { useState } from "react";
import { MapPinned, Search } from "lucide-react";
import { AdminPage, StatusPill } from "../../layouts/AdminLayout";
import { routes } from "../../data/adminMockData";

export default function RouteManagement() {
  const [selected, setSelected] = useState(routes[0]);
  const [keyword, setKeyword] = useState("");
  const filtered = routes.filter((route) => [route.id, route.name, route.status].join(" ").toLowerCase().includes(keyword.toLowerCase()));
  return (
    <AdminPage title="Quản lý tuyến đường" subtitle="Thiết lập điểm đi, điểm đến và hành trình vận hành." actionLabel="+ Tạo tuyến đường mới" onAction={() => alert("Demo tạo tuyến đường.")}>
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[180px_1fr_130px]">
          <select className="h-11 rounded-xl border border-slate-200 px-3 text-sm font-bold"><option>Tất cả trạng thái</option></select>
          <label className="relative"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Nhập mã/tên tuyến..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 outline-none focus:border-blue-500" /></label>
          <button className="rounded-xl bg-blue-600 font-black text-white">Tìm kiếm</button>
        </div>
      </div>

      <div className="mt-5 grid gap-5 xl:grid-cols-[470px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-black uppercase tracking-wide text-slate-500">Danh sách tuyến đường</h2>
          <div className="mt-4 divide-y divide-slate-100">
            {filtered.map((route) => (
              <button key={route.id} onClick={() => setSelected(route)} className={`w-full p-4 text-left hover:bg-blue-50 ${selected?.id === route.id ? "bg-blue-50" : ""}`}>
                <div className="flex items-start justify-between gap-3"><div><p className="font-black text-blue-700">{route.id}</p><p className="mt-1 font-bold text-slate-900">{route.name}</p><p className="text-xs text-slate-500">{route.distance} · {route.duration}</p></div><StatusPill status={route.status} /></div>
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          {selected ? <div><div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-blue-50 text-blue-600"><MapPinned size={30} /></div><h2 className="mt-5 text-2xl font-black text-slate-900">{selected.name}</h2><p className="mt-2 text-slate-500">Mã tuyến {selected.id}</p><div className="mt-6 grid gap-4 md:grid-cols-3"><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Khoảng cách</p><b className="mt-2 block text-lg">{selected.distance}</b></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Thời lượng</p><b className="mt-2 block text-lg">{selected.duration}</b></div><div className="rounded-2xl bg-slate-50 p-4"><p className="text-xs font-black uppercase text-slate-400">Giá vé chuẩn</p><b className="mt-2 block text-lg">{selected.price}</b></div></div><div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-400">Khu vực mô phỏng bản đồ tuyến đường / danh sách trạm dừng.</div></div> : <p>Chọn tuyến bên trái.</p>}
        </section>
      </div>
    </AdminPage>
  );
}
