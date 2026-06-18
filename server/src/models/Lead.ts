import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: String,
  phone: String,
  formId: String,
  adId: String,
  pageId: String,
  timestamp: { type: Number, default: Date.now }
});

export const LeadModel = mongoose.model('Lead', leadSchema);
