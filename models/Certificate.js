import mongoose from "mongoose";

const CertificateSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    issuer: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "General" },
    notes: { type: String, trim: true, default: "" },
    image: {
      data: { type: String, default: "" }, // base64-encoded
      contentType: { type: String, default: "" },
    },
    issueDate: { type: Date },
    expiryDate: { type: Date, required: true },
    alertDaysBefore: { type: Number, required: true, default: 30, min: 1 },
    alertsSent: { type: [Number], default: [] },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
);

CertificateSchema.index({ owner: 1, expiryDate: 1 });

export default mongoose.models.Certificate ||
  mongoose.model("Certificate", CertificateSchema);
