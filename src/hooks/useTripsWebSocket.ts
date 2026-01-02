import { useAuth } from '@/context/authContext';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const useTripsWebSocket = () => {
  const queryClient = useQueryClient();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Conectar no namespace /trips
    const socket = io(`${SOCKET_URL}/trips`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to trips websocket');
      // No backend real, o organizationId viria do token ou seria emitido aqui
      // O prompt pede para entrar em room por organizationId
    });

    socket.on('trip:started', (data: { id: string }) => {
      console.log('Trip started:', data);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    });

    socket.on('trip:updated', (data: { id: string }) => {
      console.log('Trip updated:', data);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
      if (data.id) {
        queryClient.invalidateQueries({ queryKey: ['trips', data.id] });
      }
    });

    socket.on('trip:finished', (data: { id: string }) => {
      console.log('Trip finished:', data);
      queryClient.invalidateQueries({ queryKey: ['trips'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [isAuthenticated, user, queryClient]);
};
