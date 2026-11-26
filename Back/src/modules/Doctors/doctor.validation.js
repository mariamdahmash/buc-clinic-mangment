const {
  z,
  text,
  optional,
  id,
  active,
} = require("../../utils/validation");

const schema = z
  .object({
    name: text,
    title: text,
    email: z.string().email("البريد الإلكتروني غير صحيح").max(254),
    specialtyId: id,
    bio: optional,
    image: z.string().url("رابط الصورة غير صحيح").optional().or(z.literal("")),
    isActive: active.optional(),
  })
  .strict();

module.exports = { schema };