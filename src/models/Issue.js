import mongoose from 'mongoose';

// Define the schema for the issue model
const issueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // This ensures that the 'name' field is required
    trim: true, // This removes whitespace from the beginning and end of the string
  },
  show: {
    type: Boolean,
    default: false, // This sets the default value of 'show' to false
  },
  isp_name: {type: String, required: true},
}, {
  timestamps: true, // This adds createdAt and updatedAt timestamps
});

// Check if the model already exists before creating it
const Issue = mongoose.models.Issue || mongoose.model('Issue', issueSchema);

export default Issue;
