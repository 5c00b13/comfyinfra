import { useState, useCallback, useEffect } from 'react';
import type { VoiceCommand } from '../types';

export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window)) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = (event: any) => setError(event.error);
    recognition.onresult = (event: any) => {
      const current = event.resultIndex;
      const transcript = event.results[current][0].transcript;
      setTranscript(transcript);
    };

    recognition.start();
    return recognition;
  }, []);

  const parseCommand = useCallback((transcript: string): VoiceCommand | null => {
    const words = transcript.toLowerCase().split(' ');
    
    if (words.includes('create')) {
      return {
        action: 'create',
        nodeType: words[words.indexOf('create') + 1],
      };
    }

    if (words.includes('delete')) {
      return {
        action: 'delete',
        nodeId: words[words.indexOf('delete') + 1],
      };
    }

    return null;
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    parseCommand,
  };
}