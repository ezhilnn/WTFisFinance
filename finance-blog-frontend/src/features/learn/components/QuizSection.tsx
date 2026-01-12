// src/features/learn/components/QuizSection.tsx

import { useState } from 'react';
import type { Quiz } from '../types/learn.types';
import Button from '../../../components/common/Button';
import styles from './QuizSection.module.css';

interface QuizSectionProps {
  quiz: Quiz;
}

const QuizSection = ({ quiz }: QuizSectionProps) => {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleStart = () => {
    setStarted(true);
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    return selectedAnswers.filter(
      (answer, index) => answer === quiz.questions[index].correctIndex
    ).length;
  };

  const getScorePercentage = () => {
    return Math.round((calculateScore() / quiz.questions.length) * 100);
  };

  if (!started) {
    return (
      <section className={styles.quizSection}>
        <div className={styles.quizIntro}>
          <div className={styles.quizIcon}>📝</div>
          <h2 className={styles.quizTitle}>Test Your Knowledge</h2>
          <p className={styles.quizDescription}>
            Take this quiz to check your understanding of the concepts covered in this lesson.
          </p>
          <div className={styles.quizStats}>
            <span className={styles.quizStat}>
              <strong>{quiz.questions.length}</strong> Questions
            </span>
            <span className={styles.quizStat}>
              <strong>~{Math.ceil(quiz.questions.length * 0.5)}</strong> Minutes
            </span>
          </div>
          <Button variant="primary" size="large" onClick={handleStart}>
            Start Quiz
          </Button>
        </div>
      </section>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = getScorePercentage();
    const passed = percentage >= 70;

    return (
      <section className={styles.quizSection}>
        <div className={styles.resultsCard}>
          <div className={`${styles.resultsIcon} ${passed ? styles.resultsIconPass : styles.resultsIconFail}`}>
            {passed ? '🎉' : '📚'}
          </div>
          <h2 className={styles.resultsTitle}>
            {passed ? 'Great Job!' : 'Keep Learning!'}
          </h2>
          <div className={styles.resultsScore}>
            <span className={styles.resultsScoreNumber}>{percentage}%</span>
            <span className={styles.resultsScoreText}>
              {score} out of {quiz.questions.length} correct
            </span>
          </div>
          <p className={styles.resultsMessage}>
            {passed
              ? "You've demonstrated a solid understanding of the material!"
              : "Review the material and try again to improve your score."}
          </p>
          
          {/* Answer Review */}
          <div className={styles.answerReview}>
            <h3 className={styles.answerReviewTitle}>Answer Review</h3>
            {quiz.questions.map((question, index) => {
              const userAnswer = selectedAnswers[index];
              const isCorrect = userAnswer === question.correctIndex;

              return (
                <div key={index} className={styles.reviewItem}>
                  <div className={styles.reviewHeader}>
                    <span className={`${styles.reviewStatus} ${isCorrect ? styles.reviewStatusCorrect : styles.reviewStatusIncorrect}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                    <span className={styles.reviewQuestion}>Q{index + 1}: {question.q}</span>
                  </div>
                  <div className={styles.reviewAnswers}>
                    <div className={styles.reviewAnswer}>
                      <strong>Your answer:</strong> {question.options[userAnswer]}
                    </div>
                    {!isCorrect && (
                      <div className={styles.reviewAnswer}>
                        <strong>Correct answer:</strong> {question.options[question.correctIndex]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <Button variant="primary" size="large" onClick={handleStart}>
            Retake Quiz
          </Button>
        </div>
      </section>
    );
  }

  const question = quiz.questions[currentQuestion];
  const hasAnswered = selectedAnswers[currentQuestion] !== undefined;

  return (
    <section className={styles.quizSection}>
      <div className={styles.quizCard}>
        {/* Progress */}
        <div className={styles.quizProgress}>
          <div className={styles.quizProgressBar}>
            <div
              className={styles.quizProgressFill}
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
          <span className={styles.quizProgressText}>
            Question {currentQuestion + 1} of {quiz.questions.length}
          </span>
        </div>

        {/* Question */}
        <div className={styles.question}>
          <h3 className={styles.questionText}>{question.q}</h3>
          <div className={styles.options}>
            {question.options.map((option, index) => (
              <button
                key={index}
                className={`${styles.option} ${selectedAnswers[currentQuestion] === index ? styles.optionSelected : ''}`}
                onClick={() => handleAnswer(index)}
              >
                <span className={styles.optionLabel}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className={styles.optionText}>{option}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className={styles.quizNav}>
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!hasAnswered}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default QuizSection;