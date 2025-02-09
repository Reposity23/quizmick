import bitcoinQuiz from '../data/quizzes/bitcoin.json';

// Function to shuffle array
const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Cache for quiz data
const quizzes: { [key: string]: any } = {
  bitcoin: {
    ...bitcoinQuiz,
    questions: bitcoinQuiz.questions.map(q => ({
      ...q,
      shuffledChoices: shuffleArray(q.choices)
    }))
  }
};

// Function to dynamically import quiz files
const importQuiz = async (quizId: string) => {
  try {
    const module = await import(`../data/quizzes/${quizId}.json`);
    const quizData = module.default;
    quizzes[quizId] = {
      ...quizData,
      questions: quizData.questions.map((q: any) => ({
        ...q,
        shuffledChoices: shuffleArray(q.choices)
      }))
    };
    return quizzes[quizId];
  } catch (error) {
    console.error(`Error loading quiz ${quizId}:`, error);
    return null;
  }
};

export const getQuizData = (quizId: string) => {
  if (quizzes[quizId]) {
    return {
      ...quizzes[quizId],
      questions: quizzes[quizId].questions.map((q: any) => ({
        ...q,
        shuffledChoices: shuffleArray(q.choices)
      }))
    };
  }
  return null;
};

export const getQuizTopics = () => {
  return Object.entries(quizzes).map(([id, quiz]) => ({
    id,
    topic: quiz.topic,
    total_questions: quiz.questions.length
  }));
};

// Watch for new quiz files
if (import.meta.hot) {
  import.meta.hot.accept((newModule) => {
    // Reload quizzes when files change
    Object.keys(quizzes).forEach(async (quizId) => {
      await importQuiz(quizId);
    });
  });
}