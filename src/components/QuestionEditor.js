import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { PrimaryButton, SecondaryButton } from './CommonButtons';

const QuestionEditor = ({ initialQuestions, onSave, onCancel }) => {
  const [questions, setQuestions] = useState(initialQuestions);

  const handleAddQuestion = () => {
    setQuestions([...questions, { type: 'multiple-choice', text: '', options: [] }]);
  };

  const handleQuestionChange = (index, key, value) => {
    const newQuestions = [...questions];
    newQuestions[index][key] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const handleAddOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push('');
    setQuestions(newQuestions);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleRemoveOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.splice(oIndex, 1);
    setQuestions(newQuestions);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>質問を編集</DialogTitle>
      <DialogContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {questions.map((question, qIndex) => (
                  <Draggable key={qIndex} draggableId={`question-${qIndex}`} index={qIndex}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 3, p: 2, border: '1px solid #ccc', borderRadius: 2, backgroundColor: '#f9f9f9' }}
                      >
                        <Grid container alignItems="center" spacing={1}>
                          <Grid item>
                            <IconButton {...provided.dragHandleProps}>
                              <DragIndicatorIcon />
                            </IconButton>
                          </Grid>
                          <Grid item xs>
                            <TextField
                              label={`質問 ${qIndex + 1} の内容`}
                              variant="outlined"
                              fullWidth
                              value={question.text}
                              onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                              placeholder="質問内容を入力してください"
                            />
                            <Box sx={{ mt: 2 }}>
                              {question.options.map((option, oIndex) => (
                                <Grid container alignItems="center" spacing={1} key={oIndex}>
                                  <Grid item xs>
                                    <TextField
                                      label={`選択肢 ${oIndex + 1}`}
                                      variant="outlined"
                                      fullWidth
                                      value={option}
                                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                      placeholder="選択肢を入力してください"
                                    />
                                  </Grid>
                                  <Grid item>
                                    <IconButton onClick={() => handleRemoveOption(qIndex, oIndex)}>
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              ))}
                              <SecondaryButton startIcon={<AddIcon />} onClick={() => handleAddOption(qIndex)} sx={{ mt: 1 }}>
                                選択肢を追加
                              </SecondaryButton>
                            </Box>
                          </Grid>
                          <Grid item>
                            <IconButton onClick={() => handleRemoveQuestion(qIndex)}>
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </Box>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
        <SecondaryButton startIcon={<AddIcon />} onClick={handleAddQuestion} sx={{ mt: 2 }}>
          質問を追加
        </SecondaryButton>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={onCancel}>キャンセル</SecondaryButton>
        <PrimaryButton onClick={() => onSave(questions)}>
          保存
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default QuestionEditor;