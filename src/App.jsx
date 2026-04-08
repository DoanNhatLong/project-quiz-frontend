import {Routes, Route, Navigate} from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import QuizJS from "./component/quiz/QuizJS.jsx";
import QuizPlay from "./component/quiz/QuizPlay.jsx";
import {ToastContainer} from "react-toastify";
import QuizModule from "./component/quiz/QuizModule.jsx";
import Register from "./component/login/Register.jsx";
import Profile from "./component/home/Profile.jsx";
import QuizResult from "./component/quiz/QuizResult.jsx";
import QuizFinished from "./component/quiz/QuizFinished.jsx";
import QuizReview from "./component/quiz/QuizReview.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import AdminDashboard from "./component/admin/AdminDashboard.jsx";
import AdminQuiz from "./component/admin/AdminQuiz.jsx";
import AdminAddQuestions from "./component/admin/AdminAddQuestion.jsx";
import AdminCheckQuestion from "./component/admin/AdminCheckQuestion.jsx";
import TestUpload from "./utils/TestUpload.jsx";
import TestExcel from "./utils/TestExcel.jsx";
import AdminUsers from "./component/admin/AdminUsers.jsx";
import QuizPractice from "./component/quiz/QuizPractice.jsx";
import Store from "./component/home/Store.jsx";
import AdminAIAssistant from "./component/admin/AdminAIAssistant.jsx";
import QuizExam from "./component/quiz/QuizExam.jsx";
import AdminExam from "./component/admin/AdminExam.jsx";
import OAuth2Redirect from "./component/login/OAuth2Redirect.jsx";
import ExamEditor from "./component/admin/exam/ExamEditor.jsx";
import ManagerExam from "./component/admin/exam/ManagerExam.jsx";
import ExamReview from "./component/admin/exam/ExamReview.jsx";
import CheckExam from "./component/admin/exam/CheckExam.jsx";
import ExamDetail from "./component/admin/exam/ExamDetail.jsx";
import ChallengerCreate from "./component/admin/challenger/ChallengerCreate.jsx";
import ChallengerList from "./component/challenges/ChallengerList.jsx";
import ChallengerPage from "./pages/ChallengerPage.jsx";
import ChallengerWaiting from "./component/challenges/ChallengerWaiting.jsx";
import AdminEditQuestion from "./component/admin/AdminEditQuestion.jsx";
import ChallengerStart from "./component/challenges/ChallengerStart.jsx";
import QuizSelection from "./component/quiz/QuízeSelection.jsx";
import ChallengerResult from "./component/challenges/ChallengerResult.jsx";
import ProfileReview from "./component/home/profile/ProfileReview.jsx";
import ChallengerReview from "./component/challenges/ChallengerReview.jsx";
import ChallengerSnapshot from "./component/challenges/ChallengerSnapshot.jsx";
import AdminReport from "./component/admin/AdminReport.jsx";
import AdminLog from "./component/admin/AdminLog.jsx";
import AboutUs from "./component/home/AboutUs.jsx";
import TeacherExam from "./component/teacher/TeacherExam.jsx";
import TeacherPage from "./pages/TeacherPage.jsx";
import TeacherCheck from "./component/teacher/TeacherCheck.jsx";
import TeacherResult from "./component/teacher/TeacherResult.jsx";


function App() {

    return (
        <>
            <ToastContainer/>
            <Routes>
                <Route path="/test" element={<TestUpload/>}/>
                <Route path="/testEx" element={<TestExcel/>}/>
                <Route path="/about" element={<AboutUs/>}/>
                <Route element={<AdminPage/>}>
                    <Route path="/admin" element={<AdminDashboard/>}/>
                    <Route path="/admin/quiz" element={<AdminQuiz/>}/>
                    <Route path="/admin/users" element={<AdminUsers/>}/>
                    <Route path="/admin/:quizId/add-questions" element={<AdminAddQuestions/>}/>
                    <Route path="/admin/:quizId/check-questions" element={<AdminCheckQuestion/>}/>
                    <Route path="/admin/:quizId/ai-assistant" element={<AdminAIAssistant/>}/>
                    <Route path="/admin/exam" element={<AdminExam/>}/>
                    <Route path="/admin/manager-exam" element={<CheckExam/>}/>
                    <Route path="/admin/exams/review" element={<ExamReview/>}/>
                    <Route path="/admin/exams/edit/:quizId" element={<ManagerExam/>}/>
                    <Route path="/admin/exams/create/:type" element={<ExamEditor/>}/>
                    <Route path="/admin/exam/:examId" element={<ExamDetail/>}/>
                    <Route path="/admin/report" element={<AdminReport/>}/>
                    <Route path="/admin/create-challenge" element={<ChallengerCreate/>}/>
                    <Route path="/admin/log" element={<AdminLog/>} />
                    <Route path="/admin/questions/edit/:questionId/:examId" element={<AdminEditQuestion/>}/>
                </Route>
                <Route element={<ChallengerPage/>}>
                    <Route path={"/challenger"} element={<ChallengerList/>}/>
                    <Route path={"/challenger/waiting/:challengeId"} element={<ChallengerWaiting/>}/>
                    <Route path={"/challenger/:examId/:attemptId/start"} element={<ChallengerStart/>}/>
                    <Route path={"/challenger/result/:attemptId"} element={<ChallengerResult/>}/>
                    <Route path={"/challenger/review/:challengeId"} element={<ChallengerReview/>}/>
                </Route>
                <Route element={<TeacherPage/>}>
                    <Route path={"/teacher/exam"} element={<TeacherExam/>} />
                    <Route path={"/teacher/check"} element={<TeacherCheck/>}/>
                    <Route path={"/teacher/exam-detail/:examId"} element={<TeacherResult/>} />
                </Route>
                <Route path="/login" element={<LoginPage/>}/>
                <Route path="/home/*" element={<HomePage/>}/>
                {/*<Route path="/quiz-js" element={<QuizJS/>}/>*/}
                {/*<Route path="/quiz-java" element={<QuizJava/>}/>*/}
                <Route path="/quiz/:language" element={<QuizSelection />} />
                <Route path="/register" element={<Register/>}/>
                <Route path="/oauth2/redirect" element={<OAuth2Redirect/>}/>
                <Route path="/store" element={<Store/>}/>
                <Route path="/review" element={<ProfileReview/>}/>
                <Route path="/quiz-module/:id" element={<QuizModule/>}/>
                <Route path="/quiz-exam/:quizId/:attemptId/:level" element={<QuizExam/>}/>
                <Route path="/quiz-play/:quizId/:attemptId" element={<QuizPlay/>}/>
                <Route path="/profile/*" element={<Profile/>}/>
                <Route path="/quiz-result" element={<QuizResult/>}/>
                <Route path="/quiz-practice" element={<QuizPractice/>}/>
                <Route path="/quiz-finished/:attemptId" element={<QuizFinished/>}/>
                <Route path="/quiz-review/:attemptId" element={<QuizReview/>}/>
                <Route path="/exam/snapshot/:attemptId" element={<ChallengerSnapshot/>}/>
                <Route path="*" element={<HomePage/>}/>
            </Routes>
        </>

    )
}

export default App