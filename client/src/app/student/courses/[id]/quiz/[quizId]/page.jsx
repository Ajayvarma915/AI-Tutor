'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const QuizPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(600); 
    const [isSubmitting, setIsSubmitting] = useState(false);

    
    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/quiz/generate-qa`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "classesId": 10,
                        "userId": 2,
                        "coursesId": 2,
                    }),
                });

                const data = await response.json();
                console.log("quiz data",data);
                if (data.status === 'success') {
                    setQuizData(data.data.generatedQuestions);
                } else {
                    console.error('Failed to fetch quiz data:', data.message);
                }
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        fetchQuiz();
    }, []);

    console.log(quizData);
    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit(); 
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    
    const handleAnswerChange = (questionIndex, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    
    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const payload = {
                userId: 2, 
                classId: 10,
                quizId: id,
                answers: Object.keys(answers).map((questionIndex) => ({
                    questionId: quizData[questionIndex].quizSessionId,
                    selectedAnswer: answers[questionIndex],
                })),
            };

            const response = await fetch(`http://localhost:8000/api/v1/quiz/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();
            if (result.status === 'success') {
                alert('Quiz submitted successfully!');
                router.push(`/student/courses/${id}`); 
            } else {
                console.error('Quiz submission failed:', result.message);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }

        setIsSubmitting(false);
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-semibold text-center mb-6">Quiz</h1>
            <div className="text-right text-xl font-medium mb-4">
                Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}{timeLeft % 60}
            </div>

            {quizData ? (
                <div>
                    {quizData.map((question, index) => (
                        <div key={index} className="mb-6">
                            <h3 className="text-xl font-semibold mb-4">{index + 1}. {question.question}</h3>
                            <div className="ml-6">
                                {question.options.map((option, i) => (
                                    <label key={i} className="block mb-3 text-lg cursor-pointer">
                                        <input
                                            type="radio"
                                            name={`question-${index}`}
                                            value={option}
                                            checked={answers[index] === option}
                                            onChange={() => handleAnswerChange(index, option)}
                                            disabled={isSubmitting}
                                            className="mr-3"
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Loading quiz...</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 py-3 text-xl font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
        </div>
    );
};

export default QuizPage;
