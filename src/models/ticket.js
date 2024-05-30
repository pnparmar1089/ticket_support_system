import mongoose from 'mongoose';

// Function to generate a unique ticket number in the format `Aa12-Aa12`
function generateTicketNumber() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  
  const getRandomChar = () => chars[Math.floor(Math.random() * chars.length)];
  const getRandomNumber = () => numbers[Math.floor(Math.random() * numbers.length)];
  
  return `${getRandomChar()}${getRandomChar()}${getRandomNumber()}${getRandomNumber()}-${getRandomChar()}${getRandomChar()}${getRandomNumber()}${getRandomNumber()}`;
}

const TicketSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  username: { type: String, required: true },
  isp_name: { type: String, required: true },
  status: { type: String, enum: ['open', 'close', 'working', 'solved'], default: 'open' },
  ticketNumber: { type: String, unique: true, default: generateTicketNumber },
  createdAt: { type: Date, default: Date.now }
});

// Ensure ticketNumber is unique
TicketSchema.pre('save', async function(next) {
  if (this.isNew) {
    let ticketExists;
    do {
      this.ticketNumber = generateTicketNumber();
      ticketExists = await mongoose.models.Ticket.findOne({ ticketNumber: this.ticketNumber });
    } while (ticketExists);
  }
  next();
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
