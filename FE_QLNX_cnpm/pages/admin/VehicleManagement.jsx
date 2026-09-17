import React, { useMemo, useState } from "react";
import {
  Bus,
  ChevronLeft,
  ChevronRight,
  Gauge,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Wrench,
  X,
} from "lucide-react";
import { AdminPage, StatCard, StatusPill } from "../../layouts/AdminLayout";
import { vehicles as vehicleSeed } from "../../data/adminMockData";

const emptyVehicleForm = {
  plate: "",
  type: "Xe limousine 16 chỗ",
  seats: 16,
  status: "Đang hoạt động",
  note: "",
};

function VehicleModal({ form, setForm, onClose, onSubmit }) {
  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-black text-slate-900">Thêm phương tiện</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Nhập thông tin xe để đưa vào danh sách quản lý phương tiện.</p>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"><X size={20} /></button>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-1.5">
              <span className="text-xs font-black text-slate-600">Biển số xe</span>
              <input value={form.plate} onChange={(e) => update("plate", e.target.value)} placeholder="VD: 65B-876.54" className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black text-slate-600">Phân loại</span>
              <select value={form.type} onChange={(e) => update("type", e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option>Xe limousine 9 chỗ</option>
                <option>Xe limousine 16 chỗ</option>
                <option>Xe giường nằm 32 phòng</option>
                <option>Xe giường nằm 40 chỗ</option>
                <option>Xe ghế ngồi 29 chỗ</option>
              </select>
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black text-slate-600">Số chỗ</span>
              <input type="number" min="1" value={form.seats} onChange={(e) => update("seats", e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
            <label className="space-y-1.5">
              <span className="text-xs font-black text-slate-600">Trạng thái</span>
              <select value={form.status} onChange={(e) => update("status", e.target.value)} className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
                <option>Đang hoạt động</option>
                <option>Đang bảo dưỡng</option>
                <option>Tạm ngưng</option>
              </select>
            </label>
            <label className="space-y-1.5 md:col-span-2">
              <span className="text-xs font-black text-slate-600">Ghi chú</span>
              <textarea value={form.note} onChange={(e) => update("note", e.target.value)} placeholder="Thông tin tình trạng xe, thiết bị, giấy tờ..." className="min-h-[92px] w-full rounded-xl border border-slate-200 px-3 py-3 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
            </label>
          </div>
          <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50">Hủy</button>
            <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700">Thêm phương tiện</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function VehicleManagement() {
  const [vehicles, setVehicles] = useState(vehicleSeed);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("all");
  const [type, setType] = useState("all");
  const [isModalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(emptyVehicleForm);

  const filtered = useMemo(() => {
    return vehicles.filter((item) => {
      const haystack = [item.plate, item.type, item.status].join(" ").toLowerCase();
      return haystack.includes(keyword.toLowerCase()) && (status === "all" || item.status === status) && (type === "all" || item.type === type);
    });
  }, [vehicles, keyword, status, type]);

  const saveVehicle = (e) => {
    e.preventDefault();
    setVehicles((prev) => [{ ...form, seats: Number(form.seats) || 16, plate: form.plate || `DEMO-${Date.now().toString().slice(-4)}` }, ...prev]);
    setForm(emptyVehicleForm);
    setModalOpen(false);
  };

  const resetFilters = () => {
    setKeyword("");
    setStatus("all");
    setType("all");
  };

  return (
    <AdminPage title="Quản lý phương tiện" subtitle="Theo dõi biển số, phân loại, số chỗ và trạng thái xe." actionLabel="+ Thêm phương tiện" onAction={() => setModalOpen(true)}>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard icon={Bus} label="Tổng xe" value={vehicles.length} hint="Phương tiện đang quản lý" />
        <StatCard icon={ShieldCheck} label="Đang hoạt động" value={vehicles.filter((v) => v.status === "Đang hoạt động").length} tone="emerald" hint="Sẵn sàng vận hành" />
        <StatCard icon={Wrench} label="Bảo dưỡng" value={vehicles.filter((v) => v.status === "Đang bảo dưỡng").length} tone="amber" hint="Cần kiểm tra kỹ thuật" />
        <StatCard icon={Settings} label="Tạm ngưng" value={vehicles.filter((v) => v.status === "Tạm ngưng").length} tone="rose" hint="Chưa được điều phối" />
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_190px_190px_110px]">
          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Biển số / loại xe..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white" />
          </label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"><option value="all">Tất cả trạng thái</option><option>Đang hoạt động</option><option>Đang bảo dưỡng</option><option>Tạm ngưng</option></select>
          <select value={type} onChange={(e) => setType(e.target.value)} className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold outline-none focus:border-blue-500 focus:bg-white"><option value="all">Tất cả loại xe</option><option>Xe limousine 9 chỗ</option><option>Xe limousine 16 chỗ</option><option>Xe giường nằm 32 phòng</option><option>Xe giường nằm 40 chỗ</option><option>Xe ghế ngồi 29 chỗ</option></select>
          <button onClick={resetFilters} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 text-sm font-black text-blue-700 hover:bg-blue-50"><RefreshCw size={15}/> Reset</button>
        </div>
      </div>

      <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead><tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-500"><th className="px-4 py-3">Phương tiện</th><th className="px-4 py-3">Phân loại</th><th className="px-4 py-3">Số chỗ</th><th className="px-4 py-3">Trạng thái</th><th className="px-4 py-3 text-right">Thao tác</th></tr></thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((vehicle) => (
                <tr key={vehicle.plate} className="text-sm hover:bg-blue-50/40">
                  <td className="px-4 py-4"><p className="font-black text-blue-700">{vehicle.plate}</p><p className="mt-1 text-xs font-semibold text-slate-400">ID: VEH-{vehicle.plate.replaceAll(".", "").replaceAll("-", "")}</p></td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-bold text-slate-700"><Bus size={15} className="text-slate-400" />{vehicle.type}</span></td>
                  <td className="px-4 py-4"><span className="inline-flex items-center gap-2 font-bold text-slate-600"><Gauge size={15} className="text-slate-400" />{vehicle.seats} ghế</span></td>
                  <td className="px-4 py-4"><StatusPill status={vehicle.status} /></td>
                  <td className="px-4 py-4 text-right"><div className="flex justify-end gap-1"><button className="rounded-lg px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-50">Chi tiết</button><button onClick={() => setVehicles((prev) => prev.filter((item) => item.plate !== vehicle.plate))} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"><Trash2 size={16}/></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-slate-200 px-4 py-4 text-xs font-bold text-slate-500">
          <span>Hiển thị {filtered.length} xe trên tổng số {vehicles.length}</span>
          <div className="flex items-center gap-3"><button className="rounded-lg border border-slate-200 p-2 text-slate-400"><ChevronLeft size={16}/></button><span className="text-slate-800">Trang 1 / 1</span><button className="rounded-lg border border-slate-200 p-2 text-slate-400"><ChevronRight size={16}/></button></div>
        </div>
      </div>

      {isModalOpen && <VehicleModal form={form} setForm={setForm} onClose={() => setModalOpen(false)} onSubmit={saveVehicle} />}
    </AdminPage>
  );
}
