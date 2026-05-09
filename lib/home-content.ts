export type FaqItem = {
  question: string;
  answer: string;
};

export const homeFaqs: FaqItem[] = [
  {
    question: 'How does the AI personalization work?',
    answer:
      'Our AI analyzes the job description and your experience to create perfectly matched content. It identifies key requirements, extracts relevant keywords, and tailors your achievements to align with what employers are looking for.',
  },
  {
    question: 'Is my data safe and private?',
    answer:
      'Absolutely. CareerThings AI use bank-level encryption for all data. Your information is never shared with third parties, and you can delete your data anytime. We’re fully GDPR and CCPA compliant.',
  },
  {
    question: 'Can I use CareerThings AI for multiple job applications?',
    answer:
      'Yes! You can create unlimited tailored resumes and cover letters for different positions. Our system saves your base profile and creates new versions optimized for each specific job.',
  },
  {
    question: 'What makes this better than other resume builders?',
    answer:
      'Unlike template-based builders, CareerThings uses advanced AI to create truly personalized content. Each document is uniquely tailored to the specific job, not just filled with generic text. Plus, our ATS optimization ensures your resume gets seen.',
  },
  {
    question: 'Do you offer refunds?',
    answer:
      'Yes, we offer a 30-day money-back guarantee. If you’re not satisfied with our service, contact support for a full refund.',
  },
];
