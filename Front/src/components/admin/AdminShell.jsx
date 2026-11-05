import { Activity, Building2, LogOut, Stethoscope } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminShell({ title, subtitle, children }) {
  const { user, signOut } = useAuth();
  const isSuper = user?.role === 'superadmin';
  return (
    <div className="admin-layout" dir="rtl">
      <aside className="admin-sidebar">
        <div className="admin-brand"><span className="admin-brand-mark"><Activity size={22} /></span><span>BUC <b>Clinic</b><small>Healthcare workspace</small></span></div>
        <div className="sidebar-label">مساحة العمل</div>
        <div className="sidebar-link active"><Building2 size={18} />{isSuper ? 'إدارة العيادات' : 'إدارة العيادة'}</div>
        {!isSuper && <div className="sidebar-link"><Stethoscope size={18} />التخصصات والأطباء</div>}
        <div className="sidebar-bottom"><div className="user-avatar">{user?.name?.[0] || 'U'}</div><div className="user-meta"><b>{user?.name || 'المستخدم'}</b><small>{isSuper ? 'مدير النظام' : 'مدير العيادة'}</small></div><button className="icon-button" onClick={signOut} title="تسجيل الخروج"><LogOut size={18} /></button></div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar"><div><span className="eyebrow">BUC CLINIC / DASHBOARD</span><h1>{title}</h1><p>{subtitle}</p></div><div className="topbar-status"><span className="status-dot" /> النظام متصل</div></header>
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}
