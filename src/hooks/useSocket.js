import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore } from '../stores/authStore';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (token && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:6001', {
        auth: { token },
        transports: ['websocket']
      });

      socketRef.current.on('connect', () => {
        console.log('Connected to real-time server');
      });

      socketRef.current.on('connect_error', (err) => {
        console.error('Socket connection error:', err);
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  return socketRef.current;
};