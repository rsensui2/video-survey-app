import React, { useState, lazy, Suspense } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Container, Grid, Paper, Typography, CircularProgress, Button, TextField, Link, Box } from '@mui/material';
import * as XLSX from 'xlsx';

const VideoPlayer = lazy(() => import('./components/VideoPlayer'));
const Survey = lazy(() => import('./components/Survey'));
const QuestionEditor = lazy(() => import('./components/QuestionEditor'));
const VideoEditor = lazy(() => import('./components/VideoEditor'));

export const theme = createTheme({
  palette: {
    primary: { main: '#DC143C' },
    secondary: { main: '#1E1E1E' },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
  },
});

const defaultQuestions = [
  { type: 'multiple-choice', text: '動画の内容は理解しやすかったですか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '動画の長さは適切でしたか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '動画の画質は良かったですか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '動画の音質は良かったですか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
  { type: 'multiple-choice', text: '全体的に満足できる内容でしたか？', options: ['満足', 'やや満足', 'どちらともいえない', 'やや不満', '不満'] },
];

const defaultVideos = [
  { id: 'uWUHqSvPRjA', title: '動画1: 製品紹介' },
  { id: 'FkJODF2lHuk', title: '動画2: 使用方法' },
  { id: 'b1vo26cSLtA', title: '動画3: お客様の声' }
];

const App = () => {
  const [currentStep, setCurrentStep] = useState('name');
  const [userName, setUserName] = useState('');
  const [surveyAnswers, setSurveyAnswers] = useState({});
  const [questions, setQuestions] = useState(defaultQuestions);
  const [videos, setVideos] = useState(defaultVideos);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showVideoEditor, setShowVideoEditor] = useState(false);

  const PrimaryButton = ({ children, ...props }) => (
    <Button
      variant="contained"
      color="primary"
      sx={{
        fontWeight: 'bold',
        padding: '10px 20px',
        fontSize: '1rem',
      }}
      {...props}
    >
      {children}
    </Button>
  );

  const SecondaryButton = ({ children, ...props }) => (
    <Button
      variant="outlined"
      color="primary"
      sx={{
        fontWeight: 'bold',
        padding: '10px 20px',
        fontSize: '1rem',
        borderWidth: 2,
      }}
      {...props}
    >
      {children}
    </Button>
  );

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setCurrentStep('introduction');
    }
  };

  const handleSurveyComplete = (answers, videoIndex) => {
    setSurveyAnswers(prev => ({ ...prev, [`video${videoIndex + 1}`]: answers }));
    if (videoIndex < videos.length - 1) {
      setCurrentStep(`video${videoIndex + 2}`);
    } else {
      setCurrentStep('completion');
    }
  };

  const handleQuestionsCreated = (newQuestions) => {
    setQuestions(newQuestions);
    setShowQuestionEditor(false);
  };

  const handleVideosCreated = (newVideos) => {
    setVideos(newVideos);
    setShowVideoEditor(false);
  };

  const downloadCSV = () => {
    const csvContent = generateCSVContent();
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `survey_results_${userName}.csv`;
    link.click();
  };

  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(generateJSONContent());
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Survey Results");
    XLSX.writeFile(wb, `survey_results_${userName}.xlsx`);
  };

  const generateCSVContent = () => {
    const header = ['Time', 'Name', 'Video No.', ...questions.map(q => `<${q.text}>`), '回答'].join(',');
    const timestamp = new Date().toLocaleString();
    const rows = Object.entries(surveyAnswers).flatMap(([videoKey, answers], videoIndex) => {
      return questions.map((question, questionIndex) => {
        const answer = answers[questionIndex] || '未回答';
        return [timestamp, userName, videoIndex + 1, question.text, answer].join(',');
      });
    });
    return [header, ...rows].join('\n');
  };

  const generateJSONContent = () => {
    const timestamp = new Date().toLocaleString();
    return Object.entries(surveyAnswers).flatMap(([videoKey, answers], videoIndex) => {
      return questions.map((question, questionIndex) => {
        return {
          Time: timestamp,
          Name: userName,
          'Video No.': videoIndex + 1,
          '質問名': question.text,
          '回答': answers[questionIndex] || '未回答'
        };
      });
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'name':
        return (
          <Box component="form" onSubmit={handleNameSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Typography variant="h5" gutterBottom>お名前を入力してください</Typography>
            <TextField
              label="お名前"
              variant="outlined"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              fullWidth
              required
              sx={{ maxWidth: '400px' }}
            />
            <PrimaryButton type="submit">
              開始
            </PrimaryButton>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <SecondaryButton onClick={() => setShowQuestionEditor(true)}>
                質問を編集する（管理者用）
              </SecondaryButton>
              <SecondaryButton onClick={() => setShowVideoEditor(true)}>
                動画を編集する（管理者用）
              </SecondaryButton>
            </Box>
          </Box>
        );
      case 'introduction':
        return (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <Typography variant="h5" gutterBottom>説明</Typography>
            <Typography align="center" sx={{ maxWidth: '600px' }}>
              本アプリケーションはサンプルです。この後、{videos.length}つの動画が流れ、各動画の後にアンケートにお答えください。
            </Typography>
            <PrimaryButton onClick={() => setCurrentStep('video1')}>
              開始
            </PrimaryButton>
          </Box>
        );
      default:
        if (currentStep.startsWith('video')) {
          const videoIndex = parseInt(currentStep.replace('video', ''), 10) - 1;
          return (
            <Suspense fallback={<CircularProgress />}>
              <VideoPlayer
                videoId={videos[videoIndex].id}
                title={videos[videoIndex].title}
                onComplete={() => setCurrentStep(`survey${videoIndex + 1}`)}
                goToNextStep={() => setCurrentStep(`survey${videoIndex + 1}`)}
                goToPreviousStep={() => setCurrentStep(videoIndex > 0 ? `survey${videoIndex}` : 'introduction')}
                goToTop={() => setCurrentStep('name')}
              />
            </Suspense>
          );
        }
        if (currentStep.startsWith('survey')) {
          const surveyIndex = parseInt(currentStep.replace('survey', ''), 10) - 1;
          return (
            <Suspense fallback={<CircularProgress />}>
              <Survey
                questions={questions}
                onComplete={(answers) => handleSurveyComplete(answers, surveyIndex)}
                goToNextStep={() => setCurrentStep(surveyIndex < videos.length - 1 ? `video${surveyIndex + 2}` : 'completion')}
                goToPreviousStep={() => setCurrentStep(`video${surveyIndex + 1}`)}
                isLastStep={surveyIndex === videos.length - 1}
                goToTop={() => setCurrentStep('name')}
              />
            </Suspense>
          );
        }
        if (currentStep === 'completion') {
          return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <Typography variant="h5" gutterBottom>アンケートのご協力ありがとうございました！</Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <SecondaryButton onClick={downloadCSV}>
                  CSVダウンロード
                </SecondaryButton>
                <SecondaryButton onClick={downloadExcel}>
                  Excelダウンロード
                </SecondaryButton>
              </Box>
              <PrimaryButton onClick={() => setCurrentStep('name')}>
                最初に戻る
              </PrimaryButton>
            </Box>
          );
        }
        return null;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" gutterBottom>動画アンケートアプリ</Typography>
            </Grid>
            <Grid item xs={12}>
              {renderStep()}
            </Grid>
          </Grid>
        </Paper>
      </Container>
      {showQuestionEditor && (
        <Suspense fallback={<CircularProgress />}>
          <QuestionEditor
            initialQuestions={questions}
            onSave={handleQuestionsCreated}
            onCancel={() => setShowQuestionEditor(false)}
          />
        </Suspense>
      )}
      {showVideoEditor && (
        <Suspense fallback={<CircularProgress />}>
          <VideoEditor
            initialVideos={videos}
            onSave={handleVideosCreated}
            onCancel={() => setShowVideoEditor(false)}
          />
        </Suspense>
      )}
    </ThemeProvider>
  );
};

export default App;