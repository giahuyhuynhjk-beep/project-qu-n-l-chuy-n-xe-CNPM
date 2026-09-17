import React from 'react';
import {
  Bus,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#0a1128] text-slate-400 py-16 px-8 md:px-24 border-t border-slate-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

        {/* Cột 1: Giới thiệu & Social */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-white">
            <div className="bg-cyan-500 p-1.5 rounded-lg">
              <Bus className="w-6 h-6 text-[#0a1128]" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Vận Trình</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Hệ thống đặt vé và quản lý điều hành nhà xe chuyên nghiệp,
            mang đến trải nghiệm di chuyển an toàn, tiện lợi và đáng tin cậy
            trên mọi tuyến đường.
          </p>
          <div className="flex gap-4">
            {[Facebook, Twitter, Linkedin, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                className="w-10 h-10 rounded-full border border-slate-700 flex items-center justify-center hover:bg-cyan-500 hover:text-white transition-all group"
              >
                <Icon className="w-5 h-5 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Liên kết nhanh</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Trang chủ</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Tra cứu chuyến xe</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Dành cho tài xế</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Hỗ trợ khách hàng</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Yêu cầu hỗ trợ</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors">Chat với Chatbot</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors italic opacity-80">Chính sách bảo mật</a></li>
            <li><a href="#" className="hover:text-cyan-400 transition-colors italic opacity-80">Điều khoản dịch vụ</a></li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ */}
        <div>
          <h4 className="text-white font-bold mb-6 tracking-wider uppercase text-sm">Liên hệ</h4>
          <ul className="space-y-5 text-sm">
            <li className="flex gap-3 items-start">
              <MapPin className="w-5 h-5 text-cyan-500 shrink-0" />
              <span>Tòa nhà Group 2CNPM, 123 Đường Bến Xe,Quận 1, TP. Đà Nẵng</span>
            </li>
            <li className="flex gap-3 items-center">
              <Phone className="w-5 h-5 text-cyan-500 shrink-0" />
              <span className="font-semibold text-white">0779230265</span>
            </li>
            <li className="flex gap-3 items-center">
              <Mail className="w-5 h-5 text-cyan-500 shrink-0" />
              <a href="mailto:support@group2CNPM.vn" className="hover:text-cyan-400 transition-colors">support@group2CNPM.vn</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Thanh bản quyền phía dưới */}
      <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-widest font-medium">
        <p>© 2026 Group 2CNPM. Tất cả các quyền được bảo lưu.</p>
        <div className="flex items-center gap-4 opacity-60">
          <span>Powered by Vite</span>
          <span className="text-slate-700">|</span>
          <span>Thiết kế tiêu chuẩn</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;