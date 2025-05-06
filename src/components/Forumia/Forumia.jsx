import React, { useState, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import './Forumia.scss';

const DRAFT_KEY = 'forumiaDraft';
const POSTS_KEY = 'forumiaPosts';

export default function Forumia() {
  const [draft, setDraft] = useState(
    () => localStorage.getItem(DRAFT_KEY) || ''
  );
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem(POSTS_KEY);
    return saved ? JSON.parse(saved) : [
      'How do I center a div?',
      'Why is my React component not re‑rendering?',
    ];
  });

  // save draft & posts
  useEffect(() => {
    localStorage.setItem(DRAFT_KEY, draft);
  }, [draft]);

  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  }, [posts]);

  const post = () => {
    if (draft.trim()) {
      setPosts([draft, ...posts]);
      setDraft('');
    }
  };

  return (
    <div className="forumia-container">
      <h2>Forumia</h2>
      <p>Write your question :</p>
      <Editor
        height="25vh"
        language="markdown"
        value={draft}
        onChange={v => setDraft(v)}
      />
      <button className="post-btn btn btn-primary" onClick={post}>
        Post Question
      </button>
      <div className="posts-list">
        <h3>Recent Questions:</h3>
        {posts.map((q, i) => (
          <div key={i} className="post-item">
            <pre>{q}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
