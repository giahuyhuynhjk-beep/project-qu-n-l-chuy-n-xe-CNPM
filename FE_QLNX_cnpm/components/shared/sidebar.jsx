import { Link, useLocation } from "react-router-dom"; // Import thư viện router
import "./Sidebar.css";


const Icon = ({ name, size = 18, color = "currentColor" }) => {
  const icons = {
    menu: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
      </svg>
    ),
    dashboard: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    bus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round">
        <rect x="3" y="5" width="18" height="13" rx="2"/>
        <path d="M3 10h18"/><circle cx="7" cy="18" r="1.5"/><circle cx="17" cy="18" r="1.5"/>
        <path d="M8 5V3M16 5V3"/>
      </svg>
    ),
    
    driver: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>),
    map: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polygon points="3,6 9,3 15,6 21,3 21,18 15,21 9,18 3,21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>),
    ticket: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M2 9a3 3 0 010 6v2a2 2 0 002 2h16a2 2 0 002-2v-2a3 3 0 010-6V7a2 2 0 00-2-2H4a2 2 0 00-2 2v2z"/><line x1="12" y1="7" x2="12" y2="17" strokeDasharray="2,2"/></svg>),
    payment: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>),
    refund: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="1,4 1,10 7,10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>),
    support: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M3 18v-6a9 9 0 0118 0v6"/><path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/></svg>),
    logout: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16,17 21,12 16,7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>),
    chevronLeft: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="15,18 9,12 15,6"/></svg>),
    chevronRight: (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"><polyline points="9,18 15,12 9,6"/></svg>),
  };
  return icons[name] || null;
};

const MENU_GROUPS = [
  {
    group: "QUẢN LÝ VẬN HÀNH",
    items: [
      { id: "chuyen-xe",  label: "Quản lý chuyến xe", icon: "bus", path: "/quan-ly-chuyen-xe" },
      { id: "tai-xe",     label: "Phân công tài xế & xe", icon: "driver", path: "/driver" },
      { id: "trang-thai", label: "Theo dõi trạng thái c...", icon: "map", path: "/status" },
    ],
  },
  {
    group: "QUẢN LÝ ĐẶT VÉ & CSKH",
    items: [
      { id: "dat-ve",     label: "Quản lý đặt vé", icon: "ticket", path: "/" }, // Để trang chủ là đặt vé
      { id: "thanh-toan", label: "Xác nhận thanh toán", icon: "payment", path: "/payment" },
      { id: "huy-ve",     label: "Xử lý hủy/đổi vé", icon: "refund", path: "/refund" },
      { id: "ho-tro",     label: "Hỗ trợ khách hàng", icon: "support", path: "/support" },
    ],
  },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const location = useLocation(); // Lấy URL hiện tại để highlight menu

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : "expanded"}`}>
      {/* LOGO */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Icon name="menu" size={18} color="#ffffff" />
        </div>
        {!collapsed && <span className="sidebar-logo-text">Vận Trình</span>}
      </div>

      {/* DASHBOARD */}
      <div className="sidebar-top">
        <Link 
          to="/tongquan" 
          className={`sidebar-item ${location.pathname === "/tongquan" ? "active" : ""}`}
        >
          <span style={{ flexShrink: 0 }}>
            <Icon name="dashboard" size={18} color={location.pathname === "/tongquan" ? "#ffffff" : "#6b7280"} />
          </span>
          {!collapsed && <span className="sidebar-item-label">Dashboard</span>}
        </Link>
      </div>

      {/* NHÓM MENU */}
      <div className="sidebar-scroll">
        {MENU_GROUPS.map((group) => (
          <div key={group.group} className="sidebar-group">
            {!collapsed 
              ? <div className="sidebar-group-label">{group.group}</div>
              : <div className="sidebar-group-divider" />
            }
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`sidebar-item ${isActive ? "active" : ""}`}
                  title={collapsed ? item.label : ""}
                >
                  <span style={{ flexShrink: 0 }}>
                    <Icon name={item.icon} size={18} color={isActive ? "#ffffff" : "#6b7280"} />
                  </span>
                  {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
                  {collapsed && isActive && <div className="sidebar-active-dot" />}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="sidebar-logout" title={collapsed ? "Đăng xuất" : ""}>
          <span style={{ flexShrink: 0 }}>
            <Icon name="logout" size={18} color="#ef4444" />
          </span>
          {!collapsed && <span className="sidebar-logout-text">Đăng xuất</span>}
        </div>

        <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <span style={{ flexShrink: 0 }}>
            <Icon name={collapsed ? "chevronRight" : "chevronLeft"} size={18} color="#6b7280" />
          </span>
          {!collapsed && <span>Thu gọn</span>}
        </div>
      </div>
    </div>
  );
}