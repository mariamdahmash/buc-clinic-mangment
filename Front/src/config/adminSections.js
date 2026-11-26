export const adminSections = {
  specialties: {
    label: "التخصصات",
    single: "تخصص",
    subtitle: "أضف وعدّل التخصصات الطبية المتاحة بالعيادة.",
    fields: [
      ["name", "اسم التخصص"],
      ["description", "الوصف", "textarea"],
      ["icon", "رمز تعبيري", "optional"],
    ],
  },
  doctors: {
    label: "الدكاترة",
    single: "طبيب",
    subtitle: "إدارة بيانات الأطباء وربطهم بالتخصصات.",
    fields: [
      ["name", "اسم الطبيب"],
      ["title", "الدرجة / المسمى"],
      ["email", "البريد الإلكتروني", "email"],
      ["specialtyId", "التخصص", "specialties"],
      ["image", "رابط الصورة", "url"],
      ["bio", "نبذة", "textarea"],
    ],
  },
  services: {
    label: "الخدمات",
    single: "خدمة",
    subtitle: "قائمة الخدمات الطبية والأسعار.",
    fields: [
      ["title", "اسم الخدمة"],
      ["description", "الوصف", "textarea"],
      ["price", "السعر بالجنيه", "number"],
      ["specialtyId", "التخصص (اختياري)", "specialtiesOptional"],
    ],
  },
  schedules: {
    label: "جداول العمل",
    single: "فترة عمل",
    subtitle: "أضف فترة بتاريخ محدد. جميع الأوقات بتوقيت القاهرة.",
    fields: [
      ["doctorId", "الطبيب", "doctors"],
      ["date", "التاريخ", "date"],
      ["startTime", "من الساعة", "time"],
      ["endTime", "إلى الساعة", "time"],
      ["slotMinutes", "مدة الكشف بالدقائق", "number"],
    ],
  },
  bookings: {
    label: "الحجوزات",
    single: "حجز",
    subtitle: "حجوزات الموقع والاستقبال. إلغاء الحجز يتيح الوقت من جديد.",
    fields: [
      ["patientName", "اسم المريض"],
      ["phone", "رقم التواصل", "tel"],
      ["scheduleId", "فترة العمل", "schedules"],
      ["startTime", "وقت الكشف", "slots"],
    ],
  },
};