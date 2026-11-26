import { useState } from "react";
import { Plus, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function SpecialtiesPage() {
  const { items, loading, load, busy, error, setError, notice, setNotice, createItem, updateItem, toggleStatus, deleteItem } =
    useAdminResource("specialties");

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [isActive, setIsActive] = useState(true);

  function openNew() {
    setEditingId(null);
    setName("");
    setDescription("");
    setIcon("");
    setIsActive(true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setName(item.name || "");
    setDescription(item.description || "");
    setIcon(item.icon || "");
    setIsActive(item.isActive ?? true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { name, description, icon, isActive };
    const ok = editingId ? await updateItem(editingId, payload) : await createItem(payload);
    if (ok) setIsFormOpen(false);
  }

  const filtered = items.filter((x) =>
    `${x.name} ${x.description}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="section-toolbar">
        <div>
          <h2>التخصصات</h2>
          <p>أضف وعدّل التخصصات الطبية المتاحة بالعيادة.</p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" disabled={loading || busy} onClick={load}>
            <RefreshCw size={16} /> تحديث
          </button>
          <button className="primary-button" disabled={busy || loading} onClick={openNew}>
            <Plus size={18} /> إضافة تخصص
          </button>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {notice && <div className="form-success" role="status">{notice}</div>}

      {isFormOpen && (
        <section className="editor-panel">
          <h3>{editingId ? "تعديل تخصص" : "إضافة تخصص"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <label className="field-label">
                اسم التخصص
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="field-label">
                رمز تعبيري (اختياري)
                <input type="text" placeholder="مثال: 🦷 أو ❤️" value={icon} onChange={(e) => setIcon(e.target.value)} />
              </label>
              <label className="field-label" style={{ gridColumn: "1 / -1" }}>
                الوصف
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" disabled={busy} onClick={() => setIsFormOpen(false)}>إلغاء</button>
              <button className="primary-button" disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ التخصص"}</button>
            </div>
          </form>
        </section>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input placeholder="ابحث باسم التخصص…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <span className="result-count">{filtered.length} تخصص</span>
        </div>

        {loading ? (
          <div className="empty-state">جارٍ تحميل التخصصات…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>{query ? "لا توجد نتائج" : "ابدأ بإضافة أول تخصص"}</h3>
            <p>استخدم زر الإضافة بالأعلى لإدخال التخصصات.</p>
          </div>
        ) : (
          <div className="data-list">
            {filtered.map((item) => (
              <article className="data-row" key={item._id}>
                <div className="data-primary">
                  <b>{item.icon ? `${item.icon} ` : ""}{item.name}</b>
                  <small>{item.description || "بدون وصف"}</small>
                </div>
                <span className={"state-pill " + (!item.isActive ? "paused" : "")}>
                  {item.isActive ? "نشط" : "متوقف"}
                </span>
                <div className="row-actions">
                  <button className="text-button" disabled={busy} onClick={() => openEdit(item)}>
                    <Pencil size={14} /> تعديل
                  </button>
                  <button className="text-button" disabled={busy} onClick={() => toggleStatus(item)}>
                    {item.isActive ? "تعطيل" : "تفعيل"}
                  </button>
                  <button className="text-button danger" disabled={busy} onClick={() => setDeletingId(item._id)}>
                    <Trash2 size={14} /> حذف
                  </button>
                </div>
                {deletingId === item._id && (
                  <div className="delete-confirm" role="alert">
                    حذف هذا التخصص نهائيًا؟{" "}
                    <button className="secondary-button" disabled={busy} onClick={() => setDeletingId(null)}>رجوع</button>
                    <button className="primary-button danger-bg" disabled={busy} onClick={async () => { await deleteItem(item._id); setDeletingId(null); }}>
                      تأكيد الحذف
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}