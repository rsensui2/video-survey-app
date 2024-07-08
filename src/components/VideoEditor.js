import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Box, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { PrimaryButton, SecondaryButton } from './CommonButtons';

const VideoEditor = ({ initialVideos, onSave, onCancel }) => {
  const [videos, setVideos] = useState(initialVideos);

  const handleAddVideo = () => {
    setVideos([...videos, { id: '', title: '' }]);
  };

  const handleVideoChange = (index, key, value) => {
    const newVideos = [...videos];
    newVideos[index][key] = value;
    setVideos(newVideos);
  };

  const handleRemoveVideo = (index) => {
    const newVideos = [...videos];
    newVideos.splice(index, 1);
    setVideos(newVideos);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(videos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setVideos(items);
  };

  return (
    <Dialog open onClose={onCancel} fullWidth maxWidth="md">
      <DialogTitle>動画を編集</DialogTitle>
      <DialogContent>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="videos">
            {(provided) => (
              <Box {...provided.droppableProps} ref={provided.innerRef}>
                {videos.map((video, index) => (
                  <Draggable key={index} draggableId={`video-${index}`} index={index}>
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
                              label={`動画 ${index + 1} のタイトル`}
                              variant="outlined"
                              fullWidth
                              value={video.title}
                              onChange={(e) => handleVideoChange(index, 'title', e.target.value)}
                              placeholder="動画タイトルを入力してください"
                            />
                            <TextField
                              label={`動画 ${index + 1} のID`}
                              variant="outlined"
                              fullWidth
                              value={video.id}
                              onChange={(e) => handleVideoChange(index, 'id', e.target.value)}
                              placeholder="動画IDを入力してください"
                              sx={{ mt: 1 }}
                            />
                          </Grid>
                          <Grid item>
                            <IconButton onClick={() => handleRemoveVideo(index)}>
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
        <SecondaryButton startIcon={<AddIcon />} onClick={handleAddVideo} sx={{ mt: 2 }}>
          動画を追加
        </SecondaryButton>
      </DialogContent>
      <DialogActions>
        <SecondaryButton onClick={onCancel}>キャンセル</SecondaryButton>
        <PrimaryButton onClick={() => onSave(videos)}>
          保存
        </PrimaryButton>
      </DialogActions>
    </Dialog>
  );
};

export default VideoEditor;