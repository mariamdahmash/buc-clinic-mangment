import { useState } from "react";
import { Plus, RefreshCw, Search, Pencil, Trash2 } from "lucide-react";
import { useAdminResource } from "../../hooks/useAdminResource";

export default function ServicesPage() {
  const { items, allData, loading, load, busy, error, setError, notice, setNotice, createItem, updateItem, toggleStatus, deleteItem } =
    useAdminResource("services");

  const [query, setQuery] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [specialtyId, setSpecialtyId] = useState("");
  const [isActive, setIsActive] = useState(true);

  function openNew() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setPrice(0);
    setSpecialtyId("");
    setIsActive(true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  function openEdit(item) {
    setEditingId(item._id);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setPrice(item.price ?? 0);
    setSpecialtyId(typeof item.specialtyId === "object" ? item.specialtyId?._id || "" : item.specialtyId || "");
    setIsActive(item.isActive ?? true);
    setError("");
    setNotice("");
    setIsFormOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      title,
      description,
      price: Number(price),
      specialtyId: specialtyId || null,
      isActive,
    };
    const ok = editingId ? await updateItem(editingId, payload) : await createItem(payload);
    if (ok) setIsFormOpen(false);
  }

  const filtered = items.filter((x) =>
    `${x.title} ${x.description}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="section-toolbar">
        <div>
          <h2>الخدمات</h2>
          <p>قائمة الخدمات الطبية وأسعار الكشف والإجراءات.</p>
        </div>
        <div className="toolbar-actions">
          <button className="secondary-button" disabled={loading || busy} onClick={load}>
            <RefreshCw size={16} /> تحديث
          </button>
          <button className="primary-button" disabled={busy || loading} onClick={openNew}>
            <Plus size={18} /> إضافة خدمة
          </button>
        </div>
      </div>

      {error && <div className="form-error" role="alert">{error}</div>}
      {notice && <div className="form-success" role="status">{notice}</div>}

      {isFormOpen && (
        <section className="editor-panel">
          <h3>{editingId ? "تعديل خدمة" : "إضافة خدمة جديدة"}</h3>
          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <label className="field-label">
                اسم الخدمة
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </label>
              <label className="field-label">
                السعر بالجنيه
                <input type="number" required min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} />
              </label>
              <label className="field-label">
                التخصص (اختياري)
                <select value={specialtyId} onChange={(e) => setSpecialtyId(e.target.value)}>
                  <option value="">عام / بدون تخصص محدد</option>
                  {allData.specialties.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name} {!s.isActive ? "(متوقف)" : ""}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field-label" style={{ gridColumn: "1 / -1" }}>
                الوصف
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
            </div>
            <div className="modal-actions">
              <button type="button" className="secondary-button" disabled={busy} onClick={() => setIsFormOpen(false)}>إلغاء</button>
              <button className="primary-button" disabled={busy}>{busy ? "جارٍ الحفظ…" : "حفظ الخدمة"}</button>
            </div>
          </form>
        </section>
      )}

      <div className="table-card">
        <div className="table-toolbar">
          <label className="search-field">
            <Search size={18} />
            <input placeholder="ابحث باسم الخدمة…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <span className="result-count">{filtered.length} خدمة</span>
        </div>

        {loading ? (
          <div className="empty-state">جارٍ تحميل الخدمات…</div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <h3>{query ? "لا توجد نتائج" : "ابدأ بإضافة أول خدمة"}</h3>
            <p>استخدم زر الإضافة بالأعلى لإدخال الخدمات والأسعار.</p>
          </div>
        ) : (
          <div className="data-list">
            {filtered.map((item) => (
              <article className="data-row" key={item._id}>
                <div className="data-primary">
                  <b>{item.title}</b>
                  <small>{item.price} جنيه {item.description ? `· ${item.description}` : ""}</small>
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
                    حذف هذه الخدمة نهائيًا؟{" "}
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