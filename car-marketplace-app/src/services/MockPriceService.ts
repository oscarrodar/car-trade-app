// src/services/MockPriceService.ts
import { Car, PriceUpdate } from '../types/tracking';

const MOCK_CARS: Car[] = [
  { id: '1', make: 'Toyota', model: 'Camry', year: 2023, basePrice: 25000 },
  { id: '2', make: 'Honda', model: 'Civic', year: 2022, basePrice: 22000 },
  { id: '3', make: 'Ford', model: 'Mustang', year: 2024, basePrice: 45000 },
  { id: '4', make: 'Tesla', model: 'Model 3', year: 2023, basePrice: 42000 },
  { id: '5', make: 'BMW', model: 'X5', year: 2023, basePrice: 65000 },
];

// Simulate a cache or database for current prices
const CURRENT_PRICES: { [key: string]: number } = {
  '1': 24500,
  '2': 21800,
  '3': 45500,
  '4': 41500,
  '5': 64000,
};

export const MockPriceService = {
  async getAllMockCars(): Promise<Car[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...MOCK_CARS]), 50);
    });
  },

  async getCarDetails(carId: string): Promise<Car | undefined> {
    return new Promise((resolve) => {
      const car = MOCK_CARS.find(c => c.id === carId);
      setTimeout(() => resolve(car ? { ...car } : undefined), 50);
    });
  },

  async getCurrentPrice(carId: string): Promise<PriceUpdate | undefined> {
    return new Promise((resolve) => {
      const car = MOCK_CARS.find(c => c.id === carId);
      if (!car) {
        setTimeout(() => resolve(undefined), 50);
        return;
      }

      // Simulate some minor price fluctuation for demo purposes
      const basePrice = CURRENT_PRICES[carId] || car.basePrice;
      const fluctuation = (Math.random() - 0.5) * 1000; // +/- $500
      const currentPrice = Math.round(basePrice + fluctuation);
      CURRENT_PRICES[carId] = currentPrice; // Update "current" price

      const priceUpdate: PriceUpdate = {
        carId,
        currentPrice,
        timestamp: new Date().toISOString(),
      };
      setTimeout(() => resolve(priceUpdate), 50);
    });
  },
};
