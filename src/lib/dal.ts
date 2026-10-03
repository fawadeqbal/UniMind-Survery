import connectToDatabase from './mongoose';
import Survey from '../models/Survey';

export type SurveyResponse = {
  id: string;
  name: string;
  timestamp: string;
  answers: Record<string, string>;
};

export async function getSurveyResponses(): Promise<SurveyResponse[]> {
  try {
    await connectToDatabase();
    
    // Fetch all surveys, sorted by newest first
    const surveys = await Survey.find({}).sort({ timestamp: -1 }).lean();
    
    return surveys.map((survey: any) => ({
      id: survey._id.toString(),
      name: survey.name,
      timestamp: survey.timestamp.toISOString(),
      answers: survey.answers ? (survey.answers instanceof Map ? Object.fromEntries(survey.answers) : survey.answers) : {},
    }));
  } catch (error) {
    console.error("DAL Error reading data from MongoDB:", error);
    return [];
  }
}

export async function saveSurveyResponse(name: string, answers: Record<string, string>): Promise<SurveyResponse> {
  try {
    await connectToDatabase();
    
    const newSurvey = await Survey.create({
      name,
      answers
    });
    
    return {
      id: newSurvey._id.toString(),
      name: newSurvey.name,
      timestamp: newSurvey.timestamp.toISOString(),
      answers: newSurvey.answers ? (newSurvey.answers instanceof Map ? Object.fromEntries(newSurvey.answers) : newSurvey.answers) : {}
    };
  } catch (error) {
    console.error("DAL Error saving response to MongoDB:", error);
    throw new Error('Failed to save response');
  }
}
