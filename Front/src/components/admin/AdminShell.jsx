import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ title, subtitle, counts, children }) {
  return (
    <div className="admin-layout" dir="rtl">
      <AdminSidebar counts={counts} />

      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span className="eyebrow">BUC CLINIC / DASHBOARD</span>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
          <div className="topbar-status">
            <span className="status-dot" /> مساحة الإدارة
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}