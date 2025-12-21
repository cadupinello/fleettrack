export type TripStatus = 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Driver {
  name: string;
}

export interface Vehicle {
  plate: string;
}

export interface Trip {
  id: string;
  code: string;
  origin: string;
  destination: string;
  cargo: string;
  distance: number;
  status: TripStatus;
  startTime: string;
  driver: Driver;
  vehicle: Vehicle;
  progress: number;
}

export interface TripsResponse {
  data: Trip[];
}

export interface TripResponse {
  data: Trip;
}

export interface TripFilters {
  search?: string;
  status?: TripStatus | 'all';
}
