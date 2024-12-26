-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('TEST1', 'TEST2', 'FINAL');

-- AlterTable
ALTER TABLE "Classes" ADD COLUMN     "audiofile" BYTEA;

-- CreateTable
CREATE TABLE "Exam" (
    "id" SERIAL NOT NULL,
    "coursesId" INTEGER NOT NULL,
    "testType" "TestType" NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestQuestions" (
    "id" SERIAL NOT NULL,
    "examId" INTEGER NOT NULL,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "correctAnswer" TEXT,

    CONSTRAINT "TestQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestResponse" (
    "id" SERIAL NOT NULL,
    "studentExamId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answer" TEXT,
    "isAnswered" BOOLEAN NOT NULL DEFAULT false,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "TestResponse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentExam" (
    "id" SERIAL NOT NULL,
    "studentId" INTEGER NOT NULL,
    "examId" INTEGER NOT NULL,
    "status" "QuizStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "score" INTEGER,

    CONSTRAINT "StudentExam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_coursesId_fkey" FOREIGN KEY ("coursesId") REFERENCES "Courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestQuestions" ADD CONSTRAINT "TestQuestions_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestResponse" ADD CONSTRAINT "TestResponse_studentExamId_fkey" FOREIGN KEY ("studentExamId") REFERENCES "StudentExam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExam" ADD CONSTRAINT "StudentExam_examId_fkey" FOREIGN KEY ("examId") REFERENCES "Exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentExam" ADD CONSTRAINT "StudentExam_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
