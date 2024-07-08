import React, { useState } from 'react';
import { Box, Button, Radio, RadioGroup, FormControlLabel, Typography, Container, Paper, Grid } from '@mui/material';
import { PrimaryButton, SecondaryButton } from './CommonButtons';

const Survey = ({ questions, onComplete, goToNextStep, goToPreviousStep, isLastStep, goToTop }) => {
  const [answers, setAnswers] = useState(Array(questions.length).fill(''));

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    onComplete(answers);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">アンケート</Typography>
        {questions.map((question, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Typography variant="body1" sx={{ mb: 2, fontWeight: 'bold' }}>{`Q${index + 1}. ${question.text}`}</Typography>
            <RadioGroup
              row
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              sx={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap' }}
            >
              {question.options.map((option, optionIndex) => (
                <FormControlLabel
                  key={optionIndex}
                  value={option}
                  control={<Radio color="primary" />}
                  label={option}
                  sx={{ flexBasis: { xs: '100%', sm: '45%', md: 'auto' } }}
                />
              ))}
            </RadioGroup>
          </Box>
        ))}
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item>
            <SecondaryButton onClick={goToPreviousStep}>戻る</SecondaryButton>
          </Grid>
          <Grid item>
            <PrimaryButton onClick={handleSubmit}>{isLastStep ? '完了' : '次へ'}</PrimaryButton>
          </Grid>
          <Grid item>
            <SecondaryButton onClick={goToTop}>トップに戻る</SecondaryButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Survey;