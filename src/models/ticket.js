import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  username: {type: String, required: true},
  isp_name: {type: String, required: true},
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
