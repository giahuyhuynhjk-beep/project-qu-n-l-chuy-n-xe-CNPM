import React, { useMemo, useState } from "react";
import { Bus, CalendarDays, CheckCircle2, RefreshCw, UserRound } from "lucide-react";
import { AdminPage, StatCard, StatusPill } from "../../layouts/AdminLayout";
import { drivers, trips, vehicles } from "../../data/adminMockData";

export default function AssignmentManagement() {
  const [queue, setQueue] = useState(trips);
  const [selectedTripId, setSelectedTripId] = useState(queue[0]?.id || "");
  const [driver, setDriver] = useState(drivers.find((d) => d.status === "Sẵn sàng")?.name || "");
  const [vehicle, setVehicle] = useState(vehicles.find((v) => v.status === "Đang hoạt động")?.plate || "");
  const selectedTrip = useMemo(() => queue.find((trip) => trip.id === selectedTripId), [queue, selectedTripId]);
  const waiting = queue.filter((trip) => trip.status === "Thiếu nguồn lực" || trip.driver.includes("Chưa")).length;

  const assignResource = () => {
    setQueue((prev) => prev.map((trip) => trip.id === selectedTripId ? { ...trip, driver, bus: vehicle, status: "Đã lên lịch" } : trip));
    alert("Đã phân công tạm thời trên giao diện. Chưa gửi backend.");
  };

  return (
    <AdminPage title="Phân công tài xế & xe" subtitle="Quản lý và điều phối nguồn lực vận hành theo thời gian thực." actionLabel="Làm mới dữ liệu" onAction={() => alert("Demo làm mới dữ liệu.")}>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Chờ phân công" value={waiting} hint="Chuyến cần tài xế hoặc xe" />
        <StatCard label="Tài xế khả dụng" value={drivers.filter((d) => d.status === "Sẵn sàng").length} hint="Sẵn sàng nhận chuyến" tone="emerald" />
        <StatCard label="Xe khả dụng" value={vehicles.filter((v) => v.status === "Đang hoạt động").length} hint="Phương tiện đang hoạt động" tone="slate" />
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-black text-slate-900">Hàng đợi chuyến đi</h2>
          <div className="mt-3 grid gap-3">
            {queue.map((trip) => (
              <button key={trip.id} onClick={() => setSelectedTripId(trip.id)} className={`rounded-2xl border p-4 text-left transition ${selectedTripId === trip.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                <div className="flex items-start justify-between gap-3"><p className="font-black text-slate-900">{trip.id}</p><StatusPill status={trip.status} /></div>
                <p className="mt-2 text-sm font-bold text-slate-700">{trip.route}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><CalendarDays size={13} /> {trip.time} · {trip.date}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 shadow-sm">
          {selectedTrip ? (
            <div>
              <div className="mb-5 flex items-center justify-between"><div><h2 className="text-xl font-black text-slate-900">Bảng điều phối</h2><p className="mt-1 text-sm text-slate-500">{selectedTrip.route} · {selectedTrip.time} {selectedTrip.date}</p></div><RefreshCw className="text-slate-400" /></div>
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2"><span className="flex items-center gap-2 text-sm font-black text-slate-700"><Bus size={16} /> Chọn phương tiện</span><select value={vehicle} onChange={(event) => setVehicle(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-3 font-bold outline-none focus:border-blue-500">{vehicles.map((item) => <option key={item.plate}>{item.plate}</option>)}</select></label>
                <label className="space-y-2"><span className="flex items-center gap-2 text-sm font-black text-slate-700"><UserRound size={16} /> Chọn tài xế</span><select value={driver} onChange={(event) => setDriver(event.target.value)} className="h-12 w-full rounded-xl border border-slate-200 px-3 font-bold outline-none focus:border-blue-500">{drivers.map((item) => <option key={item.id}>{item.name}</option>)}</select></label>
              </div>
              <div className="mt-6 rounded-2xl bg-slate-50 p-5"><p className="font-black text-slate-900">Thông tin chuyến</p><div className="mt-3 grid gap-3 text-sm md:grid-cols-2"><p><b>Mã:</b> {selectedTrip.id}</p><p><b>Tuyến:</b> {selectedTrip.route}</p><p><b>Xe hiện tại:</b> {selectedTrip.bus}</p><p><b>Tài xế hiện tại:</b> {selectedTrip.driver}</p></div></div>
              <button onClick={assignResource} className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-black text-white hover:bg-blue-700">Xác nhận phân công</button>
            </div>
          ) : (
            <div className="flex min-h-[420px] flex-col items-center justify-center text-center text-slate-400"><Bus size={48} /><p className="mt-4 text-lg font-black text-slate-600">Bàn điều phối trống</p><p className="mt-1 text-sm">Hãy chọn một chuyến ở hàng đợi bên trái.</p></div>
          )}
        </section>
      </div>
    </AdminPage>
  );
}
