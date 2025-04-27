// app/components/EntryForm.js
'use client';
import React, { useState } from 'react';

export default function EntryForm({ onEntryAdded }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setMessage('Title and content are required');
      return;
    }

    try {
      const timestamp = new Date().toISOString();
      const response = await fetch('/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content, timestamp }),
      });
      const data = await response.json();

      if (response.ok) {
        setMessage('Entry saved!');
        setTitle('');
        setContent('');
        onEntryAdded();
      } else {
        setMessage(data.error || 'Failed to save');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <h2>Add Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: '300px', padding: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            style={{ width: '300px', height: '100px', padding: '5px' }}
          />
        </div>
        <button type="submit" style={{ padding: '5px 10px' }}>
          Save Entry
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}