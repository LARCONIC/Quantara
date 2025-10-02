import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import '../styles/readme.css';

const ReadmePage: React.FC = () => {
  const [markdown, setMarkdown] = useState('');
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const url = searchParams.get('url');

    if (url) {
      fetch(url)
        .then(response => response.text())
        .then(text => setMarkdown(text))
        .catch(error => console.error('Error fetching readme:', error));
    }
  }, [location.search]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-20">
      <div className="prose prose-invert max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

export default ReadmePage;
