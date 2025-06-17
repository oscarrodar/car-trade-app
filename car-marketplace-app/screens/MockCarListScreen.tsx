// screens/MockCarListScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, Alert } from 'react-native';
import { useTrackingStore } from '../src/store/trackingStore';
import { Car } from '../src/types/tracking';
import { MockPriceService } from '../src/services/MockPriceService';

interface MockCarItemProps {
  car: Car;
  onTrack: () => void;
  isTracking: boolean;
}

const MockCarItem: React.FC<MockCarItemProps> = ({ car, onTrack, isTracking }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{car.make} {car.model} ({car.year})</Text>
      <Text style={styles.itemPrice}>Base Price: ${car.basePrice}</Text>
      <Button
        title={isTracking ? "Already Tracking" : "Track Price"}
        onPress={onTrack}
        disabled={isTracking}
      />
    </View>
  );
};

const MockCarListScreen = () => {
  const { addTrackedCar, trackedCars } = useTrackingStore();
  const [mockCars, setMockCars] = useState<Car[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      setIsLoading(true);
      const cars = await MockPriceService.getAllMockCars();
      setMockCars(cars);
      setIsLoading(false);
    };
    fetchCars();
  }, []);

  const handleTrackCar = (car: Car) => {
    addTrackedCar(car);
    Alert.alert("Car Added", `${car.make} ${car.model} is now being tracked.`);
  };

  const isCarCurrentlyTracked = (carId: string) => {
    return trackedCars.some(tc => tc.carId === carId);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading available cars...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Discover Cars</Text>
      {mockCars.length === 0 && !isLoading ? (
        <Text style={styles.emptyText}>No cars available to track currently.</Text>
      ) : (
        <FlatList
          data={mockCars}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MockCarItem
              car={item}
              onTrack={() => handleTrackCar(item)}
              isTracking={isCarCurrentlyTracked(item.id)}
            />
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 14,
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default MockCarListScreen;
