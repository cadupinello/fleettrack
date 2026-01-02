import { useReportLocation } from '@/api/mutations/trip';
import { useGetTrips } from '@/api/queries/trip';
import { useAuth } from '@/context/authContext';
import type { Trip } from '@/types/trip';
import { useEffect } from 'react';

export const useDriverLocation = () => {
  const { user, hasRole } = useAuth();
  const { trips } = useGetTrips();
  const { mutate: reportLocation } = useReportLocation();

  useEffect(() => {
    const isDriver = hasRole(['DRIVER']);
    if (!isDriver || !user) return;

    // Encontra a viagem que está em andamento para este motorista
    const activeTrip = trips.find(
      (trip: Trip) => trip.status === 'IN_PROGRESS' && (trip as any).driverId === user.driverId
    );

    if (!activeTrip) return;

    const interval = setInterval(() => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            reportLocation({
              id: activeTrip.id,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              speed: position.coords.speed || 0,
            });
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          { enableHighAccuracy: true }
        );
      }
    }, 10000); // A cada 10 segundos

    return () => clearInterval(interval);
  }, [user, trips, hasRole, reportLocation]);
};
