'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const QuizPage = ({ params }) => {
    const router = useRouter();
    const { id } = params;
    const [quizData, setQuizData] = useState(null);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(10);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [score, setScore] = useState(null);
    const isQuizFetched = useRef(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            if (isQuizFetched.current) return;
            isQuizFetched.current = true;

            try {
                const response = await fetch(`http://localhost:8000/api/v1/quiz/generate-qa`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        classesId: 10,
                        userId: 2,
                        coursesId: 2,
                    }),
                });

                const data = await response.json();
                if (data.status === 'success') {
                    setQuizData(data.data.generatedQuestions);
                } else {
                    toast.error('Failed to load quiz data.');
                }
            } catch (error) {
                console.error('Error fetching quiz:', error);
                toast.error('Error fetching quiz. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchQuiz();
    }, []);

    useEffect(() => {
        if (!quizData || loading) return;

        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [quizData, loading, timeLeft]);

    const handleAnswerChange = (questionIndex, option) => {
        setAnswers((prev) => ({
            ...prev,
            [questionIndex]: option,
        }));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const quizSessionId = quizData[0]?.quizSessionId;
            const responsePayload = {
                quizSessionId,
                userId: 2,
                classesId: 10,
                response: quizData.map((question, index) => ({
                    questionId: question.id,
                    quizSessionId,
                    answer: answers[index] || "",
                })),
            };

            const response = await fetch(`http://localhost:8000/api/v1/quiz/ans-submission`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(responsePayload),
            });

            const result = await response.json();
            if (result.status === 'success') {
                setScore(result.data.score);
                setShowDialog(true); 
            } else {
                toast.error('Quiz submission failed. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
            toast.error('Error submitting quiz. Please try again.');
        }

        setIsSubmitting(false);
    };

    const getDialogContent = () => {
        if (score === null) {
            return "Thank you for participating in the quiz!";
        }

        if (score >= 80) {
            return (
                <>
                    <h2 className="text-2xl font-bold text-green-600">🎉 Congratulations! 🎉</h2>
                    <p className="mt-2 text-lg">You scored {score}! Excellent performance. Keep it up!</p>
                </>
            );
        }

        if (score >= 50) {
            return (
                <>
                    <h2 className="text-2xl font-bold text-yellow-600">Good Effort! 👍</h2>
                    <p className="mt-2 text-lg">You scored {score}. Practice more to achieve even better results!</p>
                </>
            );
        }

        return (
            <>
                <h2 className="text-2xl font-bold text-red-600">🙁 Try Again!</h2>
                <p className="mt-2 text-lg">You scored {score}. Don’t give up! You can do better next time!</p>
            </>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-2xl font-semibold">Loading quiz...</div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <ToastContainer />
            <h1 className="text-3xl font-semibold text-center mb-6">Quiz</h1>

            <div
                className={`fixed top-4 right-4 px-4 py-2 rounded-full text-xl font-bold text-white ${timeLeft < 30 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
                    }`}
            >
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
                <p>No quiz data available.</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full mt-6 py-3 text-xl font-semibold text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
            >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </button>

            <Dialog open={showDialog} onOpenChange={() => setShowDialog(false)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quiz Results</DialogTitle>
                    </DialogHeader>
                    <div className="text-center">{getDialogContent()}</div>
                    <DialogFooter>
                        <button
                            className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
                            onClick={() => router.push(`/student/courses/${id}`)}
                        >
                            Go to Courses
                        </button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default QuizPage;
