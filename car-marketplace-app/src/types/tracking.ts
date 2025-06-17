// src/types/tracking.ts

export interface Car {
  id: string;          // Unique identifier for the car
  make: string;        // e.g., "Toyota"
  model: string;       // e.g., "Camry"
  year: number;        // e.g., 2023
  basePrice: number;   // Original or starting price when first observed
}

export interface TrackedCar {
  carId: string;       // References Car.id
  userId: string;      // Placeholder for user identification
  targetPrice?: number; // Optional price point the user wants to be alerted at
  lastNotifiedPrice?: number; // Last price at which a notification was sent
  dateTracked: string; // ISO date string when the car tracking began
  // We can add more details here later, like notes from the user
}

export interface PriceUpdate {
  carId: string;       // References Car.id
  currentPrice: number;
  timestamp: string;   // ISO date string of this price update
}
