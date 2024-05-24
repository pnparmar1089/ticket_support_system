

import mongoose from 'mongoose';

const issueSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  // show: {
  //   type: Boolean,
  //   default: false,
  // },
});

const Issue = mongoose.model('Issue', issueSchema);

export default Issue;
