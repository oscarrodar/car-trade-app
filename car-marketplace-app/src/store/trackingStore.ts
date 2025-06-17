// src/store/trackingStore.ts
import { create } from 'zustand';
import { Car, TrackedCar, PriceUpdate } from '../types/tracking';
import { MockPriceService } from '../services/MockPriceService'; // To get car details

interface TrackingState {
  trackedCars: TrackedCar[];
  trackedCarDetails: { [carId: string]: Car }; // Cache for car details
  isLoading: boolean;
  addTrackedCar: (carToAdd: Car) => Promise<void>;
  removeTrackedCar: (carIdToRemove: string) => void;
  fetchTrackedCarDetails: () => Promise<void>; // To populate details for already tracked cars
  updateCarPrice: (priceUpdate: PriceUpdate) => void; // For future use with real-time updates
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  trackedCars: [],
  trackedCarDetails: {},
  isLoading: false,

  addTrackedCar: async (carToAdd: Car) => {
    set((state) => {
      if (state.trackedCars.find(tc => tc.carId === carToAdd.id)) {
        return state; // Already tracking
      }
      const newTrackedCar: TrackedCar = {
        carId: carToAdd.id,
        userId: 'mockUser123', // Placeholder user ID
        dateTracked: new Date().toISOString(),
      };
      return {
        trackedCars: [...state.trackedCars, newTrackedCar],
        trackedCarDetails: {
          ...state.trackedCarDetails,
          [carToAdd.id]: carToAdd, // Add details to cache
        }
      };
    });
  },

  removeTrackedCar: (carIdToRemove: string) => {
    set((state) => ({
      trackedCars: state.trackedCars.filter(tc => tc.carId !== carIdToRemove),
      trackedCarDetails: Object.fromEntries(
        Object.entries(state.trackedCarDetails).filter(([key]) => key !== carIdToRemove)
      ),
    }));
  },

  // Fetches details for all tracked cars if not already present
  // Useful if the app loads with existing trackedCar IDs but no details
  fetchTrackedCarDetails: async () => {
    const { trackedCars, trackedCarDetails } = get();
    const newDetails: { [carId: string]: Car } = {};
    let updated = false;

    set({ isLoading: true });
    for (const tc of trackedCars) {
      if (!trackedCarDetails[tc.carId]) {
        const carDetail = await MockPriceService.getCarDetails(tc.carId);
        if (carDetail) {
          newDetails[tc.carId] = carDetail;
          updated = true;
        }
      }
    }
    if (updated) {
      set((state) => ({
        trackedCarDetails: { ...state.trackedCarDetails, ...newDetails },
      }));
    }
    set({ isLoading: false });
  },

  // Placeholder for updating a car's price in the store, could be expanded later
  updateCarPrice: (priceUpdate: PriceUpdate) => {
    // This function might be used if we were to store current prices globally.
    // For now, the TrackingScreen will fetch current prices directly.
    // However, we could extend this to update a global price cache if needed.
    console.log('Price update received in store (not yet fully implemented for global state):', priceUpdate);
  }
}));

// Optional: Call fetchTrackedCarDetails when the store initializes or app loads
// This is more of an application logic concern, could be triggered from App.tsx or a root component.
// useTrackingStore.getState().fetchTrackedCarDetails();
