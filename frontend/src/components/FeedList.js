import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, CardMedia, CardActions, Button } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const FeedList = () => {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const response = await axios.get('http://localhost:8000/feeds/');
        if (Array.isArray(response.data)) {
          setFeeds(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setFeeds([]);
        }
      } catch (error) {
        console.error('Error fetching feeds:', error);
        setFeeds([]);
      }
    };

    fetchFeeds();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Feeds Configurados
      </Typography>
      <Grid container spacing={4}>
        {Array.isArray(feeds) && feeds.length > 0 ? (
          feeds.map((feed) => (
            <Grid item key={feed.id} xs={12} sm={6} md={4}>
              <StyledCard>
                <CardMedia
                  component="img"
                  alt={feed.title}
                  height="140"
                  image={feed.imageUrl || 'https://via.placeholder.com/150'}
                  title={feed.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feed.title}
                  </Typography>
                  <Typography>
                    Categoría: {feed.categoryName}
                  </Typography>
                  <Typography>
                    Último mensaje: {feed.lastMessageDate}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Ver Detalles
                  </Button>
                </CardActions>
              </StyledCard>
            </Grid>
          ))
        ) : (
          <p>No feeds available</p>
        )}
      </Grid>
    </Container>
  );
};

export default FeedList;