import React, { useState } from "react";
import { Check, Search, X } from "lucide-react";
import { AdminPage, DataTable, StatCard, StatusPill } from "../../layouts/AdminLayout";
import { accounts as seedAccounts } from "../../data/adminMockData";

export default function AccountManagement() {
  const [accounts, setAccounts] = useState(seedAccounts);
  const [keyword, setKeyword] = useState("");
  const filtered = accounts.filter((a) => [a.name, a.email, a.role, a.status].join(" ").toLowerCase().includes(keyword.toLowerCase()));
  const updateStatus = (name, status) => setAccounts((prev) => prev.map((item) => item.name === name ? { ...item, status } : item));

  return (
    <AdminPage title="Quản lý tài khoản" subtitle="Quản lý người dùng, phân quyền và yêu cầu chờ duyệt." actionLabel="+ Tạo tài khoản mới" onAction={() => alert("Demo tạo tài khoản.")}>
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Tổng tài khoản" value={accounts.length} /><StatCard label="Chờ duyệt" value={accounts.filter((a) => a.status === "Chờ duyệt").length} tone="amber" /><StatCard label="Hoạt động" value={accounts.filter((a) => a.status === "Hoạt động").length} tone="emerald" /><StatCard label="Vai trò" value="3" tone="slate" /></div>
      <div className="mt-6 grid gap-5 xl:grid-cols-[1fr_320px]">
        <section>
          <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4"><label className="relative block"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Tìm tên, email, SĐT..." className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-3 outline-none focus:border-blue-500" /></label></div>
          <DataTable columns={["Người dùng", "Vai trò", "Trạng thái", "Thao tác"]} rows={filtered} renderRow={(account) => <tr key={account.email} className="text-sm"><td className="px-4 py-4"><p className="font-black text-slate-900">{account.name}</p><p className="text-xs text-slate-500">{account.email}</p></td><td className="px-4 py-4"><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{account.role}</span></td><td className="px-4 py-4"><StatusPill status={account.status} /></td><td className="px-4 py-4"><button className="rounded-lg px-3 py-2 text-xs font-black text-blue-600 hover:bg-blue-50">Chi tiết</button></td></tr>} />
        </section>
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"><h2 className="text-lg font-black text-slate-900">Yêu cầu chờ duyệt</h2><div className="mt-4 space-y-3">{accounts.filter((a) => a.status === "Chờ duyệt").map((account) => <div key={account.email} className="rounded-2xl border border-slate-100 p-4"><p className="font-black text-slate-900">{account.name}</p><p className="text-xs text-slate-500">{account.role}</p><div className="mt-3 flex gap-2"><button onClick={() => updateStatus(account.name, "Hoạt động")} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2 text-xs font-black text-emerald-700"><Check size={14}/> Duyệt</button><button onClick={() => updateStatus(account.name, "Từ chối")} className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-rose-50 py-2 text-xs font-black text-rose-700"><X size={14}/> Từ chối</button></div></div>)}</div></aside>
      </div>
    </AdminPage>
  );
}
