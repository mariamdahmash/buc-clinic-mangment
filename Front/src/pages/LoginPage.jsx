import { useState } from 'react';
import { Activity, ArrowLeft, Eye, EyeOff, LockKeyhole, ShieldCheck } from 'lucide-react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [nationalId, setNationalId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  if (user?.role === 'superadmin' || user?.role === 'clinicadmin') return <Navigate to={user.role === 'superadmin' ? '/super-admin' : '/clinic-admin'} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault(); setError(''); setLoading(true);
    try {
      const loggedUser = await signIn({ nationalId: nationalId.trim(), password });
      if (loggedUser.role === 'superadmin') navigate('/super-admin', { replace: true });
      else if (loggedUser.role === 'clinicadmin') navigate('/clinic-admin', { replace: true });
      else { setError('هذا الحساب ليس لديه صلاحية دخول لوحة الإدارة.'); }
    } catch (err) { setError(err.message || 'تعذر تسجيل الدخول، راجعي البيانات وحاولي مرة أخرى.'); }
    finally { setLoading(false); }
  };

  return <div className="login-page" dir="rtl">
    <section className="login-visual"><div className="login-visual-brand"><Activity size={25}/><span>BUC <b>Clinic</b></span></div><div className="login-visual-copy"><span className="eyebrow">SMART CLINIC MANAGEMENT</span><h1>إدارة صحية<br/><em>أبسط وأذكى.</em></h1><p>مساحة عمل موحدة تساعدك على إدارة العيادات والتخصصات والأطباء بكفاءة.</p></div><div className="login-visual-footer"><ShieldCheck size={17}/> منصة إدارة آمنة للعيادات</div></section>
    <section className="login-panel"><div className="login-card"><div className="login-icon"><LockKeyhole size={24}/></div><span className="eyebrow">WELCOME BACK</span><h2>تسجيل الدخول</h2><p className="login-intro">أدخلي بيانات حساب الإدارة للمتابعة إلى لوحة التحكم.</p>
      <form onSubmit={handleSubmit} className="admin-form"><label>الرقم القومي</label><input value={nationalId} onChange={e=>setNationalId(e.target.value)} inputMode="numeric" autoComplete="username" placeholder="أدخلي الرقم القومي" required/><label>كلمة المرور</label><div className="password-field"><input value={password} onChange={e=>setPassword(e.target.value)} type={showPassword?'text':'password'} autoComplete="current-password" placeholder="أدخلي كلمة المرور" required/><button type="button" onClick={()=>setShowPassword(v=>!v)} aria-label="إظهار كلمة المرور">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div>
      {error && <div className="form-error">{error}</div>}<button className="primary-button login-submit" disabled={loading}>{loading?'جارٍ تسجيل الدخول...':'دخول إلى لوحة التحكم'}<ArrowLeft size={18}/></button></form><div className="login-note">هذه البوابة مخصصة لمسؤولي النظام ومديري العيادات.</div></div><div className="login-copyright">© {new Date().getFullYear()} BUC Clinic. All rights reserved.</div></section>
  </div>;
}
