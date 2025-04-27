// app/page.js;
'use client';
import React from 'react'
import { useState } from 'react';
import EntryForm from './components/EntryForm';
import EntryList from './components/EntryList';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshEntries = () => {
    setRefreshKey((prev) => prev + 1); // Trigger re-fetch in EntryList
  };

  return (
    <main style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Personal Journal App</h1>
      <EntryForm onEntryAdded={refreshEntries} />
      <EntryList refreshKey={refreshKey} />
    </main>
  );
}