import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/ReactToastify.css";
const Content = () => {
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [noOfAnswers, setNoOfAnswers] = useState(0);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [category, setCategory] = useState("generalKnowledge");
  const [noOfQuestions, setNoOfQuestions] = useState(5);
  // const [topic, setTopic] = useState(9);

  const TOPICS = {
    generalKnowledge: 9,
    mathematics: 19,
    computer: 18,
    history: 23,
    books: 10,
    science: 17,
    animals: 27,
    gadgets: 30,
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    switch (category) {
      case "mathematics":
        setCategory("mathematics");
        break;
      case "computer":
        setCategory("computer");
        break;
      case "history":
        setCategory("history");
        break;
      case "books":
        setCategory("books");
        break;
      case "generalKnowledge":
        setCategory("generalKnowledge");
        break;
      case "science":
        setCategory("science");
        break;
      case "animals":
        setCategory("animals");
        break;
      case "gadgets":
        setCategory("gadgets");
        break;
    }
    const apiUrl = `https://opentdb.com/api.php?amount=${noOfQuestions}&category=${TOPICS[category]}&difficulty=easy`;

    const getQuestion = async () => {
      try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const shuffledQuiz = data.results.map((q) => {
          const answers = shuffleArray([
            ...q.incorrect_answers,
            q.correct_answer,
          ]);
          return { ...q, answers };
        });
        setQuiz(shuffledQuiz);
      } catch (error) {
        console.error("There was an error fetching questions", error);
      } finally {
        setLoading(false);
      }
    };
    getQuestion();
  }, [category, noOfQuestions]);
  console.log(quiz);
  const handleNextQuestion = () => {
    if (quiz.length - 1 === currentQuestionIndex) {
      setResult(true);
      toast.success("Submitted Succesfully");
      return 0;
    }
    setIsCorrect(null);
    setSelectedAnswer(null);
    if (currentQuestionIndex + 1 < quiz.length) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
    if (noOfAnswers + 1 === quiz.length) {
      setIsPending(false);
    }
  };

  const answerChecker = (selectedAnswer) => {
    if (!quiz.length) return;
    if (noOfAnswers === currentQuestionIndex) {
      setNoOfAnswers(noOfAnswers + 1);

      setSelectedAnswer(selectedAnswer);
      if (quiz[currentQuestionIndex].correct_answer === selectedAnswer) {
        setScore(score + 20);
        setIsCorrect(true);
      } else {
        setIsCorrect(false);
      }
    }
  };

  const allAnswers = quiz.length ? quiz[currentQuestionIndex].answers : [];
  const reset = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setNoOfAnswers(0);
    setResult(false);
    setSelectedAnswer(null);
    setIsPending(true);
    toast.success("Reset Completed");
  };
  return (
    <div className="container">
      <div>
        <h3>Quiz App</h3>
        <form>
          <div className="category-container">
            <label htmlFor="category">Question Category</label>
            <select
              id="category"
              name="category"
              className=""
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="mathematics">Mathematics</option>
              <option value="generalKnowledge">General Knowledge</option>
              <option value="computer">Computer</option>
              <option value="animals">Animals</option>
              <option value="science">Science and Nature</option>
              <option value="history">History</option>
              <option value="books">Books</option>
              <option value="gadgets">Gadgets</option>
            </select>
          </div>
          <div className="category-container">
            <label htmlFor="category">Amount of Question</label>
            <select
              id="amount"
              name="amount"
              className=""
              required
              value={noOfQuestions}
              onChange={(e) => setNoOfQuestions(e.target.value)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </form>
        <hr />
        {result ? (
          <>
            <h3>You scored {score} / 100</h3>
            <div className="button-container">
              <button className="submit" onClick={reset}>
                Reset
              </button>
            </div>
          </>
        ) : (
          <>
            {loading ? (
              <h2>Loading question...</h2>
            ) : (
              <p className="question">{quiz[currentQuestionIndex].question}</p>
            )}
            <ul>
              {allAnswers.map((answer, index) => (
                <li
                  className={`answers ${
                    selectedAnswer === answer
                      ? isCorrect
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  key={answer}
                  onClick={() => answerChecker(answer)}
                >
                  {index + 1}. {""} {answer}
                </li>
              ))}
            </ul>
            <div className="button-container">
              {!isPending && (
                <button className="submit" onClick={handleNextQuestion}>
                  Submit
                </button>
              )}
              {isPending && (
                <button className="submit" onClick={handleNextQuestion}>
                  Next
                </button>
              )}
            </div>
            <div className="page">
              {!loading && (
                <p>
                  {currentQuestionIndex + 1} of {quiz?.length} questions
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Content;
