import React, { useEffect } from 'react';
import { Textarea } from './ui/textarea';
import { Card, CardContent } from './ui/card';
import { useStatusProvider } from '@/contexts/StatusProvider';

function Message() {
  const { messages } = useStatusProvider();

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.scrollTop = textarea.scrollHeight;
    }
  }, [messages]);

  return (
    
        <Textarea
          rows={6}
          value={messages.join('\n')}
          readOnly
          className='tw-text-xl'
        />
  );
}

export default Message;
