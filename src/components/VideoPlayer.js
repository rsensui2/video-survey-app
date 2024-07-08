import React, { useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography, Container, Paper, Grid } from '@mui/material';
import { PrimaryButton, SecondaryButton } from './CommonButtons';

const VideoPlayer = ({ videoId, title, onComplete, goToNextStep, goToPreviousStep, goToTop }) => {
  const playerRef = useRef(null);

  const handleVideoEnd = () => {
    onComplete();
  };

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.internalPlayer.loadVideoById(videoId);
    }
  }, [videoId]);

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom align="center">{title}</Typography>
        <Box sx={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', mb: 3 }}>
          <YouTube
            videoId={videoId}
            ref={playerRef}
            opts={{
              width: '100%',
              height: '100%',
              playerVars: { autoplay: 1 }
            }}
            onEnd={handleVideoEnd}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
          />
        </Box>
        <Grid container spacing={2} justifyContent="center" sx={{ mt: 2 }}>
          <Grid item>
            <SecondaryButton onClick={goToPreviousStep}>
              戻る
            </SecondaryButton>
          </Grid>
          <Grid item>
            <PrimaryButton onClick={goToNextStep}>
              次へ
            </PrimaryButton>
          </Grid>
          <Grid item>
            <SecondaryButton onClick={goToTop}>
              トップに戻る
            </SecondaryButton>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default VideoPlayer;