'use client';

import React, { useState, useEffect } from 'react';
import { FaTwitter, FaFacebookF, FaWhatsapp, FaEnvelope, FaLink, FaCheck } from 'react-icons/fa'; // Using react-icons

interface ShareButtonsProps {
  url: string;
  title: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title }) => {
  const [fullUrl, setFullUrl] = useState('');
  const [copied, setCopied] = useState(false);

  // Construct full URL on the client-side
  useEffect(() => {
    setFullUrl(window.location.origin + url);
  }, [url]);

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(fullUrl);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    }).catch(err => {
      console.error('Failed to copy: ', err);
      // Maybe show an error state to the user
    });
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      color: '#1DA1F2'
    },
    {
      name: 'Facebook',
      icon: FaFacebookF,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: '#1877F2'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      color: '#25D366'
    },
    {
      name: 'Email',
      icon: FaEnvelope,
      href: `mailto:?subject=${encodedTitle}&body=Check%20out%20this%20event:%20${encodedUrl}`,
      color: '#7f7f7f' // Generic email color
    },
  ];

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-600 mr-2">Bagikan:</span>
      {shareOptions.map((option) => (
        <a
          key={option.name}
          href={option.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Share on ${option.name}`}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition duration-200 flex items-center justify-center"
          style={{ /* You could use option.color here if desired */ }}
        >
          <option.icon className="w-4 h-4 text-gray-700" />
        </a>
      ))}
      <button
        onClick={copyToClipboard}
        title="Copy Link"
        className={`p-2 rounded-full transition duration-200 flex items-center justify-center ${copied ? 'bg-green-200 hover:bg-green-300' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        {copied ? 
          <FaCheck className="w-4 h-4 text-green-700" /> : 
          <FaLink className="w-4 h-4 text-gray-700" />
        }
      </button>
    </div>
  );
};

export default ShareButtons; 