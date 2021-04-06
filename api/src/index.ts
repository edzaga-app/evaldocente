import './config/config';
import App from './app';
import TeacherEvaluationController from './controllers/teacherEvaluationController';
import AuthController from './controllers/authController';

const app = new App([
  new TeacherEvaluationController(),
  new AuthController()
]);

app.listen();

