import React, { useState } from "react";
import { Bus, ShieldCheck, UserRound } from "lucide-react";

export default function InternalLogin({ onLogin }) {
  const [role, setRole] = useState("admin");
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600"><Bus size={28}/></div>
        <h1 className="mt-4 text-center text-2xl font-black text-slate-900">Vận Trình</h1>
        <p className="mt-1 text-center text-sm text-slate-500">Đăng nhập khối điều hành & quản trị</p>
        <div className="mt-8 rounded-2xl bg-slate-100 p-1"><div className="grid grid-cols-2 gap-1"><button onClick={() => setRole("admin")} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black ${role === "admin" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}><ShieldCheck size={16}/> Quản trị viên</button><button onClick={() => setRole("staff")} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-black ${role === "staff" ? "bg-white text-blue-700 shadow" : "text-slate-500"}`}><UserRound size={16}/> Nhân viên</button></div></div>
        <label className="mt-5 block"><span className="text-sm font-black text-slate-700">Tài khoản đăng nhập</span><input className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500" placeholder="Nhập tên tài khoản"/></label>
        <label className="mt-4 block"><span className="text-sm font-black text-slate-700">Mật khẩu bảo mật</span><input type="password" className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 outline-none focus:border-blue-500" placeholder="Nhập mật khẩu"/></label>
        <button onClick={onLogin} className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-black text-white hover:bg-blue-700">Đăng nhập hệ thống</button>
      </div>
    </div>
  );
}
