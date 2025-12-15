import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api'; // <--- UPDATED: Import central API helper

/**
 * Visualizer Component
 * A self-contained speed reading (RSVP) module.
 */
export default function Visualizer() {
  // --- Motivational messages ---
  const messages = [
    'Fuel your goals — type here to level up 💪',
    'Sharpen your focus — your journey starts here 🚀',
    'Train your brain — read smarter, not harder ⚡',
    'Unlock your potential — one word at a time 📖',
    'Boost your speed — your mind is limitless 🌟',
  ];

  const quotes = [
    'Let’s boost your focus today 💫',
    'Consistency beats speed — but why not both? 🚀',
    'Your only limit is your attention span 🔥',
    'Feed your mind. Focus your power. ⚡',
    'You’re not just reading — you’re evolving 🧠',
  ];

  const [inputText, setInputText] = useState(() => {
    const random = Math.floor(Math.random() * messages.length);
    return messages[random];
  });

  const [quote, setQuote] = useState(() => {
    const random = Math.floor(Math.random() * quotes.length);
    return quotes[random];
  });

  // --- State Variables ---
  const [chunks, setChunks] = useState([]);
  
  // This is the default word shown before you start
  const [currentChunk, setCurrentChunk] = useState('Visualizer'); 
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wpm, setWpm] = useState(300);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const intervalRef = useRef(null);

  // --- Helper Functions ---
  const calculateDelay = () => {
    if (wpm === 0) return null;
    return 60000 / wpm;
  };

  const fetchChunks = async () => {
    setIsLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentChunk('Loading...');

    try {
      // <--- UPDATED: Use api.post instead of fetch
      // URL becomes '/visualizer/chunks' (api.js handles the domain)
      const response = await api.post('/visualizer/chunks', {
        text: inputText,
        chunkSize: 1,
      });

      // Axios returns the data directly in response.data
      const data = response.data;

      if (data.chunks && data.chunks.length > 0) {
        setChunks(data.chunks);
        setCurrentIndex(0);
        setCurrentChunk(data.chunks[0]);
      } else {
        setChunks([]);
        setCurrentChunk('No text found.');
      }
    } catch (err) {
      console.error(err);
      setError(
        `Error: ${err.message || 'Failed to process text'}. Is the backend running?`
      );
      setCurrentChunk('Error!');
    } finally {
      setIsLoading(false);
    }
  };

  const startReading = () => {
    if (chunks.length === 0 || isLoading) return;
    setIsPlaying(true);

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        if (nextIndex >= chunks.length) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          setCurrentChunk('Done!');
          return prevIndex;
        }
        setCurrentChunk(chunks[nextIndex]);
        return nextIndex;
      });
    }, calculateDelay());
  };

  const pauseReading = () => {
    setIsPlaying(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const resetReading = () => {
    pauseReading();
    if (chunks.length > 0) {
      setCurrentIndex(0);
      setCurrentChunk(chunks[0]);
    } else {
      setCurrentChunk('Visualizer');
    }
  };

  useEffect(() => {
    if (!isPlaying) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    startReading();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [wpm, isPlaying, chunks]);

  // --- Render ---
  return (
    <div
      style={{
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        width: '100%',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        padding: '1.5rem',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          marginBottom: '1rem',
          fontSize: '1.1rem',
          fontWeight: '500',
          color: '#2563eb',
        }}
      >
        {quote}
      </div>

      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '3rem 1rem',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        <span
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#1f2937',
          }}
        >
          {currentChunk}
        </span>
      </div>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Fuel your goals — type here to level up 💪"
        disabled={isLoading}
        style={{
          width: '100%',
          minHeight: '100px',
          boxSizing: 'border-box',
          padding: '0.75rem',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          fontSize: '0.9rem',
          marginBottom: '1rem',
          resize: 'vertical',
        }}
      />

      {error && (
        <div
          style={{
            color: '#ef4444',
            backgroundColor: '#fee2e2',
            padding: '0.75rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center',
            fontSize: '0.9rem',
          }}
        >
          {error}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={fetchChunks}
          disabled={isLoading || inputText.trim() === ''}
          style={buttonStyle(isLoading || inputText.trim() === '')}
        >
          {isLoading ? 'Loading...' : 'Load Text'}
        </button>

        {isPlaying ? (
          <button onClick={pauseReading} style={buttonStyle()}>
            Pause
          </button>
        ) : (
          <button
            onClick={startReading}
            disabled={isLoading || chunks.length === 0}
            style={buttonStyle(isLoading || chunks.length === 0)}
          >
            Start
          </button>
        )}

        <button
          onClick={resetReading}
          disabled={isLoading || chunks.length === 0}
          style={buttonStyle(isLoading || chunks.length === 0)}
        >
          Reset
        </button>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}
      >
        <label
          htmlFor="wpm-slider"
          style={{
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#374151',
          }}
        >
          Speed: {wpm} WPM
        </label>
        <input
          type="range"
          id="wpm-slider"
          min="50"
          max="1500"
          step="25"
          value={wpm}
          onChange={(e) => setWpm(Number(e.target.value))}
          disabled={isLoading}
          style={{ width: '100%' }}
        />
      </div>
    </div>
  );
}

const buttonStyle = (disabled = false) => ({
  flex: '1 1 auto',
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  fontWeight: '600',
  color: 'white',
  backgroundColor: disabled ? '#9ca3af' : '#3b82f6',
  border: 'none',
  borderRadius: '8px',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.7 : 1,
  transition: 'background-color 0.2s ease',
});