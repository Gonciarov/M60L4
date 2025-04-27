// app/components/EntryList.js
'use client';
import React from 'react';
import { useState, useEffect } from 'react';

export default function EntryList({ refreshKey }) {
  const [entries, setEntries] = useState([]);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/api/entries');
      if (!response.ok) {
        throw new Error('Failed to fetch entries');
      }
      const data = await response.json();
      setEntries(data.entries);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [refreshKey]); // Re-fetch when refreshKey changes

  return (
    <div>
      <h2>Journal Entries</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {entries.length === 0 && !error ? (
        <p>No entries yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {entries.map((entry) => (
            <li key={entry.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <h3>{entry.title}</h3>
              <p>{entry.content}</p>
              <p style={{ fontSize: '0.8em', color: '#555' }}>
                {new Date(entry.timestamp).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}