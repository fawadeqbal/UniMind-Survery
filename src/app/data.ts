export type Option = {
  id: string;
  label: string;
};

export type Question = {
  id: string;
  section: string;
  title: string;
  options: Option[];
};

export const surveyData = {
  title: "Beyond the Books: Academic Stress Among University Students",
  description: "This survey aims to explore the hidden causes of academic stress among university students. It focuses on academic performance, emotional challenges, social expectations, study habits, and university experiences.",
  note: "Your participation is voluntary. Your responses will remain anonymous and will be used for academic purposes only.",
  questions: [
    {
      id: "q1",
      section: "Section 1: Academic Background",
      title: "1. What is your current semester?",
      options: [
        { id: "q1_1", label: "1st semester" },
        { id: "q1_2", label: "2nd semester" },
        { id: "q1_3", label: "3rd semester" },
        { id: "q1_4", label: "4th semester" },
        { id: "q1_5", label: "5th semester" },
        { id: "q1_6", label: "6th semester" },
        { id: "q1_7", label: "7th semester" },
        { id: "q1_8", label: "8th semester" }
      ]
    },
    {
      id: "q2",
      section: "Section 1: Academic Background",
      title: "2. How would you describe your current academic performance?",
      options: [
        { id: "q2_1", label: "Excellent" },
        { id: "q2_2", label: "Very good" },
        { id: "q2_3", label: "Good" },
        { id: "q2_4", label: "Average" },
        { id: "q2_5", label: "Below average" }
      ]
    },
    {
      id: "q3",
      section: "Section 1: Academic Background",
      title: "3. What was your GPA in the previous semester?",
      options: [
        { id: "q3_1", label: "3.50–4.00" },
        { id: "q3_2", label: "3.00–3.49" },
        { id: "q3_3", label: "2.50–2.99" },
        { id: "q3_4", label: "2.00–2.49" },
        { id: "q3_5", label: "Below 2.00" },
        { id: "q3_6", label: "Not applicable" }
      ]
    },
    {
      id: "q4",
      section: "Section 2: Academic Experiences",
      title: "4. How often do you feel mentally exhausted after a day at university?",
      options: [
        { id: "q4_1", label: "Very often" },
        { id: "q4_2", label: "Often" },
        { id: "q4_3", label: "Sometimes" },
        { id: "q4_4", label: "Rarely" },
        { id: "q4_5", label: "Never" }
      ]
    },
    {
      id: "q5",
      section: "Section 2: Academic Experiences",
      title: "5. Which part of your academic routine consumes the most energy?",
      options: [
        { id: "q5_1", label: "Attending lectures" },
        { id: "q5_2", label: "Completing assignments" },
        { id: "q5_3", label: "Preparing for exams" },
        { id: "q5_4", label: "Managing multiple subjects" },
        { id: "q5_5", label: "Balancing studies with personal life" }
      ]
    },
    {
      id: "q6",
      section: "Section 2: Academic Experiences",
      title: "6. How comfortable are you with the pace at which your courses are taught?",
      options: [
        { id: "q6_1", label: "Very comfortable" },
        { id: "q6_2", label: "Somewhat comfortable" },
        { id: "q6_3", label: "Neutral" },
        { id: "q6_4", label: "Uncomfortable" },
        { id: "q6_5", label: "Very uncomfortable" }
      ]
    },
    {
      id: "q7",
      section: "Section 2: Academic Experiences",
      title: "7. What do you usually do when a subject becomes difficult to understand?",
      options: [
        { id: "q7_1", label: "Ask the teacher for help" },
        { id: "q7_2", label: "Study with classmates" },
        { id: "q7_3", label: "Search for online explanations" },
        { id: "q7_4", label: "Avoid the topic temporarily" },
        { id: "q7_5", label: "Try to understand it independently" }
      ]
    },
    {
      id: "q8",
      section: "Section 2: Academic Experiences",
      title: "8. How often do unexpected academic tasks disturb your daily plans?",
      options: [
        { id: "q8_1", label: "Very often" },
        { id: "q8_2", label: "Often" },
        { id: "q8_3", label: "Sometimes" },
        { id: "q8_4", label: "Rarely" },
        { id: "q8_5", label: "Never" }
      ]
    },
    {
      id: "q9",
      section: "Section 2: Academic Experiences",
      title: "9. Which academic situation makes you feel least confident?",
      options: [
        { id: "q9_1", label: "Speaking in front of the class" },
        { id: "q9_2", label: "Solving difficult questions" },
        { id: "q9_3", label: "Submitting assignments" },
        { id: "q9_4", label: "Taking examinations" },
        { id: "q9_5", label: "Receiving feedback on my work" }
      ]
    },
    {
      id: "q10",
      section: "Section 3: Emotional and Psychological Pressure",
      title: "10. How often do you feel guilty when you take time off from studying?",
      options: [
        { id: "q10_1", label: "Almost always" },
        { id: "q10_2", label: "Often" },
        { id: "q10_3", label: "Sometimes" },
        { id: "q10_4", label: "Rarely" },
        { id: "q10_5", label: "Never" }
      ]
    },
    {
      id: "q11",
      section: "Section 3: Emotional and Psychological Pressure",
      title: "11. What is your first thought when you receive a grade lower than expected?",
      options: [
        { id: "q11_1", label: "I should have worked harder." },
        { id: "q11_2", label: "Maybe I am not capable enough." },
        { id: "q11_3", label: "I need to change my study method." },
        { id: "q11_4", label: "I worry about my GPA." },
        { id: "q11_5", label: "I accept it and move forward." }
      ]
    },
    {
      id: "q12",
      section: "Section 3: Emotional and Psychological Pressure",
      title: "12. How frequently do you worry about your academic future?",
      options: [
        { id: "q12_1", label: "Daily" },
        { id: "q12_2", label: "Several times a week" },
        { id: "q12_3", label: "Occasionally" },
        { id: "q12_4", label: "Rarely" },
        { id: "q12_5", label: "Never" }
      ]
    },
    {
      id: "q13",
      section: "Section 3: Emotional and Psychological Pressure",
      title: "13. Do you ever feel that your efforts are not enough, even after studying for hours?",
      options: [
        { id: "q13_1", label: "Very often" },
        { id: "q13_2", label: "Often" },
        { id: "q13_3", label: "Sometimes" },
        { id: "q13_4", label: "Rarely" },
        { id: "q13_5", label: "Never" }
      ]
    },
    {
      id: "q14",
      section: "Section 3: Emotional and Psychological Pressure",
      title: "14. How often does academic pressure affect your mood outside university?",
      options: [
        { id: "q14_1", label: "Very often" },
        { id: "q14_2", label: "Often" },
        { id: "q14_3", label: "Sometimes" },
        { id: "q14_4", label: "Rarely" },
        { id: "q14_5", label: "Never" }
      ]
    },
    {
      id: "q15",
      section: "Section 3: Emotional and Psychological Pressure",
      title: "15. Which feeling best describes your academic life lately?",
      options: [
        { id: "q15_1", label: "Motivated" },
        { id: "q15_2", label: "Overwhelmed" },
        { id: "q15_3", label: "Uncertain" },
        { id: "q15_4", label: "Confident" },
        { id: "q15_5", label: "Emotionally drained" }
      ]
    },
    {
      id: "q16",
      section: "Section 4: Social and Family Expectations",
      title: "16. How much does comparing your academic performance with classmates affect you?",
      options: [
        { id: "q16_1", label: "A great deal" },
        { id: "q16_2", label: "Quite a lot" },
        { id: "q16_3", label: "Moderately" },
        { id: "q16_4", label: "A little" },
        { id: "q16_5", label: "Not at all" }
      ]
    },
    {
      id: "q17",
      section: "Section 4: Social and Family Expectations",
      title: "17. Whose expectations influence your academic decisions the most?",
      options: [
        { id: "q17_1", label: "My own" },
        { id: "q17_2", label: "Parents or family" },
        { id: "q17_3", label: "Teachers" },
        { id: "q17_4", label: "Friends or classmates" },
        { id: "q17_5", label: "Future career expectations" }
      ]
    },
    {
      id: "q18",
      section: "Section 4: Social and Family Expectations",
      title: "18. How do you feel when classmates achieve something you were also working toward?",
      options: [
        { id: "q18_1", label: "Inspired" },
        { id: "q18_2", label: "Happy for them" },
        { id: "q18_3", label: "Pressured to do better" },
        { id: "q18_4", label: "Discouraged" },
        { id: "q18_5", label: "It does not affect me" }
      ]
    },
    {
      id: "q19",
      section: "Section 4: Social and Family Expectations",
      title: "19. How comfortable are you sharing academic difficulties with your family?",
      options: [
        { id: "q19_1", label: "Very comfortable" },
        { id: "q19_2", label: "Somewhat comfortable" },
        { id: "q19_3", label: "Neutral" },
        { id: "q19_4", label: "Uncomfortable" },
        { id: "q19_5", label: "Very uncomfortable" }
      ]
    },
    {
      id: "q20",
      section: "Section 4: Social and Family Expectations",
      title: "20. Have you ever chosen a course or academic goal mainly to satisfy someone else's expectations?",
      options: [
        { id: "q20_1", label: "Yes" },
        { id: "q20_2", label: "No" },
        { id: "q20_3", label: "Not sure" }
      ]
    },
    {
      id: "q21",
      section: "Section 4: Social and Family Expectations",
      title: "21. How much pressure do you feel to maintain a certain GPA?",
      options: [
        { id: "q21_1", label: "Extremely high" },
        { id: "q21_2", label: "High" },
        { id: "q21_3", label: "Moderate" },
        { id: "q21_4", label: "Low" },
        { id: "q21_5", label: "None" }
      ]
    },
    {
      id: "q22",
      section: "Section 5: Habits, Motivation and Coping",
      title: "22. What usually distracts you most when you try to study?",
      options: [
        { id: "q22_1", label: "Mobile phone or social media" },
        { id: "q22_2", label: "Overthinking" },
        { id: "q22_3", label: "Noise or surroundings" },
        { id: "q22_4", label: "Tiredness" },
        { id: "q22_5", label: "Personal responsibilities" }
      ]
    },
    {
      id: "q23",
      section: "Section 5: Habits, Motivation and Coping",
      title: "23. What is your most common response when academic work feels overwhelming?",
      options: [
        { id: "q23_1", label: "Make a new study plan" },
        { id: "q23_2", label: "Postpone the work" },
        { id: "q23_3", label: "Take a break" },
        { id: "q23_4", label: "Ask someone for help" },
        { id: "q23_5", label: "Continue working despite feeling exhausted" }
      ]
    },
    {
      id: "q24",
      section: "Section 5: Habits, Motivation and Coping",
      title: "24. How often do you sacrifice sleep to complete academic tasks?",
      options: [
        { id: "q24_1", label: "Very often" },
        { id: "q24_2", label: "Often" },
        { id: "q24_3", label: "Sometimes" },
        { id: "q24_4", label: "Rarely" },
        { id: "q24_5", label: "Never" }
      ]
    },
    {
      id: "q25",
      section: "Section 5: Habits, Motivation and Coping",
      title: "25. What helps you regain motivation after a disappointing academic result?",
      options: [
        { id: "q25_1", label: "Encouragement from others" },
        { id: "q25_2", label: "Setting new goals" },
        { id: "q25_3", label: "Taking time to relax" },
        { id: "q25_4", label: "Remembering my long-term ambitions" },
        { id: "q25_5", label: "Nothing seems to help immediately" }
      ]
    },
    {
      id: "q26",
      section: "Section 5: Habits, Motivation and Coping",
      title: "26. How confident are you in managing your academic workload?",
      options: [
        { id: "q26_1", label: "Very confident" },
        { id: "q26_2", label: "Confident" },
        { id: "q26_3", label: "Moderately confident" },
        { id: "q26_4", label: "Not very confident" },
        { id: "q26_5", label: "Not confident at all" }
      ]
    },
    {
      id: "q27",
      section: "Section 6: University Environment and Solutions",
      title: "27. How often do you feel that you have no time for your interests because of studies?",
      options: [
        { id: "q27_1", label: "Very often" },
        { id: "q27_2", label: "Often" },
        { id: "q27_3", label: "Sometimes" },
        { id: "q27_4", label: "Rarely" },
        { id: "q27_5", label: "Never" }
      ]
    },
    {
      id: "q28",
      section: "Section 6: University Environment and Solutions",
      title: "28. How approachable do you find your teachers when you face academic difficulties?",
      options: [
        { id: "q28_1", label: "Very approachable" },
        { id: "q28_2", label: "Somewhat approachable" },
        { id: "q28_3", label: "Neutral" },
        { id: "q28_4", label: "Not very approachable" },
        { id: "q28_5", label: "Not approachable at all" }
      ]
    },
    {
      id: "q29",
      section: "Section 6: University Environment and Solutions",
      title: "29. Which university facility or service would be most helpful during stressful academic periods?",
      options: [
        { id: "q29_1", label: "Academic advising" },
        { id: "q29_2", label: "Counselling services" },
        { id: "q29_3", label: "Quiet study spaces" },
        { id: "q29_4", label: "Peer study groups" },
        { id: "q29_5", label: "Better online learning resources" }
      ]
    },
    {
      id: "q30",
      section: "Section 6: University Environment and Solutions",
      title: "30. If you could remove one hidden pressure from university life, what would it be?",
      options: [
        { id: "q30_1", label: "Fear of failure" },
        { id: "q30_2", label: "Constant comparison" },
        { id: "q30_3", label: "Family expectations" },
        { id: "q30_4", label: "Uncertainty about the future" },
        { id: "q30_5", label: "Pressure to always be productive" }
      ]
    }
  ]
};
