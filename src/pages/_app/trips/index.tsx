import { useGetTrips } from '@/api/queries/trip';
import { useDriverLocation } from '@/hooks/useDriverLocation';
import { useTripsWebSocket } from '@/hooks/useTripsWebSocket';
import type { Trip, TripStatus } from '@/types/trip';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { TripsFilters } from './components/TripsFilters';
import { TripsList } from './components/TripsList';

export const Route = createFileRoute('/_app/trips/')({
  component: TripsIndexPage,
});

function TripsIndexPage() {
  useTripsWebSocket();
  useDriverLocation();
  const { trips, isLoading, isError, refetch } = useGetTrips();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TripStatus | 'all'>('all');

  const filteredTrips = trips.filter((trip: Trip) => {
    const matchesSearch = 
      trip.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <TripsFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />

      <TripsList
        trips={filteredTrips}
        isLoading={isLoading}
        isError={isError}
        onRetry={() => refetch()}
      />
    </div>
  );
}
