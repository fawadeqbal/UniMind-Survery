import { NextResponse } from 'next/server';
import { getSurveyResponses, saveSurveyResponse } from '@/lib/dal';

export async function GET() {
  const responses = await getSurveyResponses();
  return NextResponse.json({ responses });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Delegate the persistence logic to the Data Access Layer
    const newResponse = await saveSurveyResponse(body.name, body.answers);
    
    return NextResponse.json({ success: true, response: newResponse });
  } catch (error) {
    console.error("Error in POST /api/survey:", error);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
}
