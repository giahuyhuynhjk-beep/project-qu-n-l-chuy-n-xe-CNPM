import React, { useMemo } from "react";
import { ChevronLeft, LogOut, Menu, Search, User } from "lucide-react";
import { adminMenuGroups } from "../data/adminMockData";
import { useAuth } from "../src/contexts/AuthContext";

export function AdminSidebar({ activeKey, onChangePage }) {
  const { user, logout } = useAuth();
  return (
    <aside className="flex h-screen w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
          <Menu size={18} />
        </div>
        <div>
          <p className="text-sm font-black text-slate-900">BusFlow</p>
          <p className="text-[11px] font-semibold text-slate-400">Admin Console</p>
        </div>
        <ChevronLeft className="ml-auto text-slate-400" size={18} />
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
        {adminMenuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-2 text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
              {group.title}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = item.key === activeKey;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => onChangePage(item.key)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition ${
                      active
                        ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                        : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3 space-y-1">
        {/* User info */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 mb-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <User size={14} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-[12px] font-black text-slate-800">{user?.username || "Admin"}</p>
            <p className="text-[10px] text-slate-400 font-semibold">Quản trị viên</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold text-red-500 hover:bg-red-50"
        >
          <LogOut size={16} />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}

export default function AdminLayout({ activeKey, onChangePage, children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-700">
      <div className="flex min-h-screen">
        <AdminSidebar activeKey={activeKey} onChangePage={onChangePage} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

export function AdminTopbar({ title, subtitle, actionLabel, onAction }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{title}</h1>
          <p className="mt-1 text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="relative hidden lg:block">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              placeholder="Tìm nhanh trong hệ thống..."
              className="h-10 w-72 rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:bg-white"
            />
          </label>
          {actionLabel && (
            <button
              type="button"
              onClick={onAction}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-black text-white shadow-sm hover:bg-blue-700"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function AdminPage({ title, subtitle, actionLabel, onAction, children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <AdminTopbar title={title} subtitle={subtitle} actionLabel={actionLabel} onAction={onAction} />
      <main className="p-5 lg:p-6">{children}</main>
    </div>
  );
}

export function StatCard({ label, value, hint, tone = "blue", icon: Icon }) {
  const tones = {
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    amber: "border-amber-100 bg-amber-50 text-amber-700",
    rose: "border-rose-100 bg-rose-50 text-rose-700",
    emerald: "border-emerald-100 bg-emerald-50 text-emerald-700",
    slate: "border-slate-100 bg-white text-slate-700",
  };
  return (
    <div className={`rounded-2xl border p-5 shadow-sm ${tones[tone] || tones.blue}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-wide opacity-70">{label}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
        {Icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
            <Icon size={20} />
          </div>
        )}
      </div>
      {hint && <p className="mt-2 text-xs font-semibold opacity-70">{hint}</p>}
    </div>
  );
}

export function StatusPill({ status }) {
  const style = useMemo(() => {
    if (["Hoạt động", "Đã xác nhận", "Đang hoạt động", "Đã duyệt", "On time", "Đang vận hành", "Hoàn thành"].includes(status)) {
      return "bg-emerald-100 text-emerald-700";
    }
    if (["Chờ duyệt", "Chờ xử lý", "Chờ thanh toán", "Đã lên lịch", "Thiếu nguồn lực"].includes(status)) {
      return "bg-amber-100 text-amber-700";
    }
    if (["Bị hủy", "Đã hủy", "Tạm ngưng", "Đang bảo trì", "Đang bảo dưỡng", "Delayed"].includes(status)) {
      return "bg-rose-100 text-rose-700";
    }
    return "bg-slate-100 text-slate-600";
  }, [status]);
  return <span className={`rounded-full px-2.5 py-1 text-[11px] font-black ${style}`}>{status}</span>;
}

export function DataTable({ columns, rows, renderRow }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-black uppercase tracking-wide text-slate-500">
              {columns.map((col) => (
                <th key={col} className="px-4 py-3">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">{rows.map(renderRow)}</tbody>
        </table>
      </div>
    </div>
  );
}
