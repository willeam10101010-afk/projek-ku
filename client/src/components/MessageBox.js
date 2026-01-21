import React, { useState, useEffect } from 'react';
import './MessageBox.css';

const MessageBox = ({ message, onUpdate, isLoading, account }) => {
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const MAX_LENGTH = 280;

  useEffect(() => {
    setCharCount(newMessage.length);
  }, [newMessage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!newMessage.trim()) {
      setError('Message cannot be empty');
      return;
    }

    if (newMessage.length > MAX_LENGTH) {
      setError(`Message is too long (max ${MAX_LENGTH} characters)`);
      return;
    }

    if (!account) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      await onUpdate(newMessage);
      setNewMessage('');
    } catch (err) {
      setError(err.message || 'Failed to update message');
    }
  };

  return (
    <div className="message-box">
      <div className="current-message-section">
        <h2>Current Message</h2>
        <div className="message-display">
          {isLoading ? (
            <div className="loading">Loading...</div>
          ) : message ? (
            <p className="message-text">{message}</p>
          ) : (
            <p className="no-message">No message yet</p>
          )}
        </div>
      </div>

      <div className="update-message-section">
        <h2>Update Message</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <textarea
              className="message-input"
              placeholder="Enter your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!account || isLoading}
              rows="4"
              maxLength={MAX_LENGTH}
            />
            <div className="char-counter">
              <span className={charCount > MAX_LENGTH ? 'error' : ''}>
                {charCount} / {MAX_LENGTH}
              </span>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button
            type="submit"
            className="submit-button"
            disabled={!account || isLoading || !newMessage.trim()}
          >
            {isLoading ? 'Updating...' : 'Update Message'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessageBox;
