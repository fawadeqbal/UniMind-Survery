import mongoose from 'mongoose';

const SurveySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  answers: {
    type: Map,
    of: String,
    required: true,
  }
}, { timestamps: true });

// Delete the model if it exists to ensure schema updates are applied during hot-reload
if (mongoose.models.Survey) {
  delete mongoose.models.Survey;
}

export default mongoose.model('Survey', SurveySchema);
