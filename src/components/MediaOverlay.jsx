import React, { useState, useEffect } from 'react';
import './css/MediaOverlay.css';
import Spotify from '../assets/spotify.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinimize, faLink } from '@fortawesome/free-solid-svg-icons';

const CLIENT_ID = '896388c6998b43d6966ac3dd5b15e97c';
const REDIRECT_URI = 'https://teamsharenetwork.netlify.app';
const SCOPES = 'user-read-playback-state user-read-currently-playing';

const MediaOverlay = () => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotifyAccessToken'));
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCurrentTrack = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) {
          setAccessToken(null);
          localStorage.removeItem('spotifyAccessToken');
          setError('Your Spotify session has expired. Please log in again.');
          return;
        }

        if (response.status === 204) {
          setCurrentTrack(null);
          return;
        }

        const data = await response.json();
        if (data && data.item) {
          setCurrentTrack({
            name: data.item.name,
            artist: data.item.artists.map(artist => artist.name).join(', '),
            cover: data.item.album.images[0].url,
            id: data.item.id,
            album: data.item.album.name,
            releaseDate: data.item.album.release_date,
            popularity: data.item.popularity,
            explicit: data.item.explicit,
          });
          setDuration(data.item.duration_ms);
        } else {
          setCurrentTrack(null);
        }
      } catch (error) {
        console.error('Failed to fetch current track:', error);
      }
    };

    const fetchPlaybackState = async () => {
      if (!accessToken) return;
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });

        if (response.status === 401) {
          setAccessToken(null);
          localStorage.removeItem('spotifyAccessToken');
          setError('Your Spotify session has expired. Please log in again.');
          return;
        }

        if (response.status === 204) {
          setProgress(0);
          return;
        }

        const data = await response.json();
        if (data && data.progress_ms) {
          setProgress(data.progress_ms);
        }
      } catch (error) {
        console.error('Failed to fetch playback state:', error);
      }
    };

    fetchCurrentTrack();
    fetchPlaybackState();
    const trackInterval = setInterval(fetchCurrentTrack, 1000);
    const progressInterval = setInterval(fetchPlaybackState, 1000);
    return () => {
      clearInterval(trackInterval);
      clearInterval(progressInterval);
    };
  }, [accessToken]);

  const handleToggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleLogin = () => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    const handleAuthCallback = () => {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const token = params.get('access_token');
      if (token) {
        localStorage.setItem('spotifyAccessToken', token);
        setAccessToken(token);
        window.location.hash = '';
      }
    };

    if (window.location.hash) {
      handleAuthCallback();
    }
  }, []);

  const progressPercentage = duration ? (progress / duration) * 100 : 0;

  return (
    <div className={`media-overlay ${isMinimized ? 'minimized' : ''}`}>
      {!isMinimized && error && (
        <div className="login-spotify">
          <img src={Spotify} className='spotify-logo'/>
          <p>{error}</p>
          <button onClick={handleLogin} className="login-button">
            <FontAwesomeIcon icon={faLink} />
            <b>Connect To Spotify</b>
          </button>
        </div>
      )}
      {!isMinimized && !error && !accessToken && (
        <div className="login-spotify">
          <img src={Spotify} className='spotify-logo'/>
          <button onClick={handleLogin} className="login-button">
            <FontAwesomeIcon icon={faLink} />
            <b>Connect To Spotify</b>
          </button>
        </div>
      )}
      {!isMinimized && accessToken && currentTrack && (
        <div className="track-info">
          <img src={Spotify} className='spotify-logo'/>
          <div className="cover-container">
            <img src={currentTrack.cover} alt={currentTrack.name} className="cover-image"/>
            {currentTrack.explicit ? <span aria-label="Explicit" className="explicit-label" title="Explicit">E</span> : ''}
          </div>
          <div className="details">
            <h3>{currentTrack.name}</h3>
            <p>{currentTrack.artist}</p>
            <p>Album: {currentTrack.album}</p>
            <p>Released: {currentTrack.releaseDate}</p>
            <p>Popularity: {currentTrack.popularity}</p>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          <button onClick={handleToggleMinimize} className="minimize-button">
            <FontAwesomeIcon icon={faMinimize} />
          </button>
        </div>
      )}
      {!isMinimized && accessToken && !currentTrack && (
        <div className="no-track-message">
          <button onClick={handleToggleMinimize} className="minimize-button">
            <FontAwesomeIcon icon={faMinimize} />
          </button>
          <img src={Spotify} className='spotify-logo'/>
          <p>Start playing any song or listen to what you like!</p>
        </div>
      )}
      {isMinimized && currentTrack && (
        <>
          <img
            src={currentTrack.cover}
            alt={currentTrack.name}
            className="minimized-cover-image"
            onClick={handleToggleMinimize}
          />
        </>
      )}
      <button onClick={handleToggleMinimize} className="minimize-button">
        <FontAwesomeIcon icon={isMinimized ? faMaximize : faMinimize} />
      </button>
    </div>
  );
};

export default MediaOverlay;