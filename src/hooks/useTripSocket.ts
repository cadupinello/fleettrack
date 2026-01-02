import type { TripResponse } from '@/types/trip';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Namespace /trips
const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3000';

export const useTripSocket = (tripId?: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!tripId) return;

    // Conectar no namespace /trips
    const newSocket = io(`${SOCKET_URL}/trips`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log(`Connected to trips namespace - Trip: ${tripId}`);
      setIsConnected(true);
      // Emitir join:trip ao montar componente
      newSocket.emit('join:trip', { tripId });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from trips namespace');
      setIsConnected(false);
    });

    // Ouvir eventos de atualização
    newSocket.on('trip:location:update', (data: any) => {
      console.log('Location update:', data);
      // Atualizar cache via queryClient.setQueryData
      queryClient.setQueryData(['trips', tripId], (oldData: TripResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            ...data,
          },
        };
      });
    });

    newSocket.on('trip:progress:update', (data: { progress: number }) => {
      console.log('Progress update:', data);
      queryClient.setQueryData(['trips', tripId], (oldData: TripResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            progress: data.progress,
          },
        };
      });
    });

    newSocket.on('trip:status:update', (data: { status: any }) => {
      console.log('Status update:', data);
      queryClient.setQueryData(['trips', tripId], (oldData: TripResponse | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            status: data.status,
          },
        };
      });
    });

    setSocket(newSocket);

    return () => {
      // Emitir leave:trip ao desmontar
      newSocket.emit('leave:trip', { tripId });
      newSocket.disconnect();
    };
  }, [tripId, queryClient]);

  return { socket, isConnected };
};

export const useTripLiveProgress = (tripId?: string) => {
  const { isConnected } = useTripSocket(tripId);
  return {
    isLive: isConnected,
  };
};
