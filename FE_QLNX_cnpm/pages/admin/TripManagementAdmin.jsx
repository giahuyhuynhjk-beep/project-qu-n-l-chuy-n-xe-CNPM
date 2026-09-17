
import React, { useMemo, useState } from "react";
import { Activity, AlertTriangle, BarChart3, Bus, Calendar, ChevronRight, Clock, Eye, Filter, Pencil, Plus, Search, User, X } from "lucide-react";
import { AdminPage, DataTable, StatCard, StatusPill } from "../../layouts/AdminLayout";
import {
  drivers,
  routes as routeOptions,
  trips as tripSeed,
  vehicles,
} from "../../data/adminMockData";

const statusOptions = ["Đã lên lịch", "Đang vận hành", "Thiếu nguồn lực", "Hoàn thành", "Đã hủy"];

const emptyTripForm = {
  routeId: routeOptions[0]?.id || "",
  date: "",
  time: "",
  endTime: "",
  vehiclePlate: vehicles[0]?.plate || "",
  driverId: drivers[0]?.id || "",
  status: "Đã lên lịch",
};

function buildTripId() {
  return `TR-${Date.now().toString().slice(-6)}`;
}

function normalizeTripFromForm(form, oldTrip = {}) {
  const selectedRoute = routeOptions.find((route) => route.id === form.routeId) || routeOptions[0];
  const selectedVehicle = vehicles.find((vehicle) => vehicle.plate === form.vehiclePlate) || vehicles[0];
  const selectedDriver = drivers.find((driver) => driver.id === form.driverId) || drivers[0];

  return {
    ...oldTrip,
    id: oldTrip.id || buildTripId(),
    date: form.date,
    time: form.time,
    endTime: form.endTime,
    route: selectedRoute?.name || "Chưa chọn tuyến",
    routeId: selectedRoute?.id || form.routeId,
    routeDetail: selectedRoute?.name || "Chưa chọn tuyến",
    bus: selectedVehicle?.plate || "Chưa chọn xe",
    busType: selectedVehicle?.type || "Chưa xác định loại xe",
    driver: selectedDriver?.name || "Chưa chọn tài xế",
    driverId: selectedDriver?.id || form.driverId,
    driverPhone: selectedDriver?.phone || "Chưa xác nhận",
    seatsSold: oldTrip.seatsSold ?? 0,
    seatsTotal: selectedVehicle?.seats || oldTrip.seatsTotal || 0,
    status: form.status,
    revenue: oldTrip.revenue || "0đ",
  };
}

function buildFormFromTrip(trip) {
  const matchedRoute = routeOptions.find((route) => route.id === trip.routeId || route.name === trip.route);
  const matchedVehicle = vehicles.find((vehicle) => vehicle.plate === trip.bus);
  const matchedDriver = drivers.find((driver) => driver.id === trip.driverId || driver.name === trip.driver);

  return {
    routeId: matchedRoute?.id || routeOptions[0]?.id || "",
    date: trip.date || "",
    time: trip.time || "",
    endTime: trip.endTime || "",
    vehiclePlate: matchedVehicle?.plate || vehicles[0]?.plate || "",
    driverId: matchedDriver?.id || drivers[0]?.id || "",
    status: trip.status || "Đã lên lịch",
  };
}

export default function TripManagementAdmin() {
  const [trips, setTrips] = useState(tripSeed);
  const [keyword, setKeyword] = useState("");
  const [routeFilter, setRouteFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingTripId, setEditingTripId] = useState(null);
  const [form, setForm] = useState(emptyTripForm);

  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchKeyword = [trip.id, trip.route, trip.bus, trip.driver]
        .join(" ")
        .toLowerCase()
        .includes(keyword.toLowerCase());
      const matchRoute = routeFilter === "all" || trip.routeId === routeFilter || trip.route === routeFilter;
      const matchStatus = statusFilter === "all" || trip.status === statusFilter;
      const matchDate = !dateFilter || trip.date === dateFilter;
      return matchKeyword && matchRoute && matchStatus && matchDate;
    });
  }, [trips, keyword, routeFilter, statusFilter]);

  const averageFillRate = trips.length
    ? Math.round(
        trips.reduce((sum, trip) => sum + (trip.seatsTotal ? trip.seatsSold / trip.seatsTotal : 0), 0) /
          trips.length *
          100
      )
    : 0;

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingTripId(null);
    setForm(emptyTripForm);
    setIsFormOpen(true);
  };

  const openEditForm = (trip) => {
    setFormMode("edit");
    setEditingTripId(trip.id);
    setForm(buildFormFromTrip(trip));
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTripId(null);
    setForm(emptyTripForm);
  };

  const saveTrip = (event) => {
    event.preventDefault();

    if (formMode === "create") {
      setTrips((prev) => [normalizeTripFromForm(form), ...prev]);
    } else {
      setTrips((prev) =>
        prev.map((trip) =>
          trip.id === editingTripId ? normalizeTripFromForm(form, trip) : trip
        )
      );
    }

    closeForm();
  };

  const resetFilter = () => {
    setKeyword("");
    setRouteFilter("all");
    setStatusFilter("all");
    setDateFilter("");
  };

  return (
    <AdminPage
      title="Quản lý chuyến đi"
      subtitle="Điều phối, giám sát nguồn lực và tình trạng lấp đầy của từng chuyến."
      actionLabel="+ Tạo chuyến đi mới"
      onAction={openCreateForm}
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Tổng số chuyến" value={trips.length} hint="Đang hiển thị trong hệ thống" icon={BarChart3} />
        <StatCard label="Đang vận hành" value={trips.filter((t) => t.status === "Đang vận hành").length} tone="emerald" icon={Activity} />
        <StatCard label="Thiếu nguồn lực" value={trips.filter((t) => t.status === "Thiếu nguồn lực").length} tone="rose" icon={AlertTriangle} />
        <StatCard label="Tỉ lệ lấp đầy" value={`${averageFillRate}%`} hint="Trung bình các chuyến" tone="slate" icon={BarChart3} />
      </div>

      <div className="my-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[220px_200px_180px_1fr_110px]">
          <select
            value={routeFilter}
            onChange={(event) => setRouteFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600"
          >
            <option value="all">Tất cả tuyến đường</option>
            {routeOptions.map((route) => (
              <option key={route.id} value={route.id}>{route.name}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-600"
          >
            <option value="all">Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>

          <label className="relative">
            <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="date"
              value={dateFilter}
              onChange={(event) => setDateFilter(event.target.value)}
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm font-bold text-slate-600 outline-none focus:border-blue-500"
            />
          </label>

          <label className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="Tìm mã chuyến đi, tuyến, xe, tài xế..."
              className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500"
            />
          </label>

          <button onClick={resetFilter} className="flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 font-black text-blue-600 hover:bg-blue-50">
            <Filter size={15} /> Lọc
          </button>
        </div>
      </div>

      <DataTable
        columns={["Thời gian & trạng thái", "Thông tin tuyến", "Nguồn lực", "Tình trạng vé", "Thao tác"]}
        rows={filteredTrips}
        renderRow={(trip) => {
          const percent = trip.seatsTotal ? Math.round((trip.seatsSold / trip.seatsTotal) * 100) : 0;
          return (
            <tr key={trip.id} className="text-sm hover:bg-blue-50/40">
              <td className="px-4 py-4 align-top">
                <p className="flex items-center gap-1 font-black text-blue-700"><Calendar size={14} /> {trip.date}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><Clock size={13} /> {trip.time}{trip.endTime ? ` - ${trip.endTime}` : ""}</p>
                <div className="mt-2"><StatusPill status={trip.status} /></div>
              </td>
              <td className="px-4 py-4 align-top">
                <p className="font-black text-slate-900">{trip.route}</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">ID: {trip.id}</p>
                <p className="mt-1 text-xs text-slate-400">{trip.routeDetail}</p>
              </td>
              <td className="px-4 py-4 align-top">
                <p className="flex items-center gap-1 font-bold text-slate-800"><Bus size={14} /> {trip.bus}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500"><User size={13} /> {trip.driver}</p>
              </td>
              <td className="px-4 py-4 align-top"><div className="flex items-center justify-between text-xs"><b>{trip.seatsSold}/{trip.seatsTotal} ghế</b><span>{percent}%</span></div><div className="mt-2 h-2 rounded-full bg-slate-200"><div className="h-full rounded-full bg-blue-600" style={{ width: `${percent}%` }} /></div></td>
              <td className="px-4 py-4 align-top">
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setSelectedTrip(trip)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-50"><Eye size={14} /> Chi tiết <ChevronRight size={14} /></button>
                  <button onClick={() => openEditForm(trip)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-black text-slate-600 hover:bg-slate-50"><Pencil size={14} /> Sửa</button>
                </div>
              </td>
            </tr>
          );
        }}
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 bg-slate-50 p-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  {formMode === "create" ? "Tạo chuyến đi" : "Sửa chuyến đi"}
                </h2>
                <p className="mt-1 text-sm font-semibold text-slate-500">
                  Form đã bỏ mã chuyến, loại chuyến, lịch trình, tổng ghế và ghế đã đặt theo yêu cầu backend.
                </p>
              </div>
              <button onClick={closeForm} className="rounded-xl p-2 text-slate-500 hover:bg-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={saveTrip} className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-black text-slate-600">Tuyến</span>
                  <select
                    value={form.routeId}
                    onChange={(event) => updateForm("routeId", event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {routeOptions.map((route) => (
                      <option key={route.id} value={route.id}>{route.name}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black text-slate-600">Ngày chạy</span>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(event) => updateForm("date", event.target.value)}
                    required
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1.5">
                    <span className="text-xs font-black text-slate-600">Giờ đi</span>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(event) => updateForm("time", event.target.value)}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>

                  <label className="space-y-1.5">
                    <span className="text-xs font-black text-slate-600">Giờ đến</span>
                    <input
                      type="time"
                      value={form.endTime}
                      onChange={(event) => updateForm("endTime", event.target.value)}
                      required
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />
                  </label>
                </div>

                <label className="space-y-1.5">
                  <span className="text-xs font-black text-slate-600">Biển số xe</span>
                  <select
                    value={form.vehiclePlate}
                    onChange={(event) => updateForm("vehiclePlate", event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {vehicles.map((vehicle) => (
                      <option key={vehicle.plate} value={vehicle.plate}>{vehicle.plate} · {vehicle.type}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5">
                  <span className="text-xs font-black text-slate-600">Tài xế</span>
                  <select
                    value={form.driverId}
                    onChange={(event) => updateForm("driverId", event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {drivers.map((driver) => (
                      <option key={driver.id} value={driver.id}>{driver.name} · {driver.phone}</option>
                    ))}
                  </select>
                </label>

                <label className="space-y-1.5 md:col-span-2">
                  <span className="text-xs font-black text-slate-600">Trạng thái</span>
                  <select
                    value={form.status}
                    onChange={(event) => updateForm("status", event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                <button type="button" onClick={closeForm} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-black text-slate-600 hover:bg-slate-50">
                  Hủy
                </button>
                <button type="submit" className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700">
                  {formMode === "create" ? "Tạo chuyến đi" : "Lưu thay đổi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedTrip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-slate-200 bg-slate-50 p-6"><div className="flex items-center justify-between"><StatusPill status={selectedTrip.status} /><span className="font-black text-slate-500">ID: {selectedTrip.id}</span></div><h2 className="mt-4 text-3xl font-black text-slate-900">Chi tiết chuyến đi</h2><p className="mt-2 text-slate-500">Thông tin vận hành và trạng thái nguồn lực của chuyến.</p></div>
            <div className="space-y-5 p-6">
              <section className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-black text-blue-700">Lịch trình & địa điểm</p><h3 className="mt-4 text-xl font-black text-slate-900">{selectedTrip.routeDetail}</h3><div className="mt-4 grid grid-cols-2 gap-4 text-sm"><div><p className="text-slate-500">Ngày khởi hành</p><b>{selectedTrip.date}</b></div><div><p className="text-slate-500">Giờ xuất bến</p><b>{selectedTrip.time}{selectedTrip.endTime ? ` - ${selectedTrip.endTime}` : ""}</b></div></div></section>
              <section className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-black text-blue-700">Điều phối nguồn lực</p><div className="mt-4 space-y-3"><p className="font-black text-slate-900">{selectedTrip.bus} <span className="text-sm font-semibold text-slate-500">· {selectedTrip.busType}</span></p><p className="font-black text-slate-900">{selectedTrip.driver} <span className="text-sm font-semibold text-slate-500">· {selectedTrip.driverPhone}</span></p></div></section>
              <section className="rounded-2xl bg-slate-50 p-5"><p className="text-sm font-black text-blue-700">Tình trạng đặt vé</p><div className="mt-4 flex items-end justify-between"><div><p className="text-3xl font-black text-slate-900">{selectedTrip.seatsSold}</p><p className="text-xs font-bold uppercase text-slate-500">Vé đã bán / {selectedTrip.seatsTotal} ghế</p></div><p className="text-2xl font-black text-emerald-600">{Math.round((selectedTrip.seatsSold / selectedTrip.seatsTotal) * 100)}%</p></div></section>
            </div>
            <div className="flex justify-end border-t border-slate-200 p-5"><button onClick={() => setSelectedTrip(null)} className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white">Đóng</button></div>
          </div>
        </div>
      )}
    </AdminPage>
  );
}
