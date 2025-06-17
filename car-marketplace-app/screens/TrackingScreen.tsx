// screens/TrackingScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { useTrackingStore } from '../src/store/trackingStore';
import { Car, PriceUpdate } from '../src/types/tracking';
import { MockPriceService } from '../src/services/MockPriceService';

// Define a type for the navigation prop for type safety
type RootStackParamList = {
  MockCarList: undefined; // Assuming MockCarListScreen doesn't take params
  // Add other screen names here if needed
};
type TrackingScreenNavigationProp = NavigationProp<RootStackParamList>;

interface TrackedCarItemProps {
  car: Car;
  currentPrice?: number;
  onUntrack: () => void;
  isLoadingPrice: boolean;
}

const TrackedCarItem: React.FC<TrackedCarItemProps> = ({ car, currentPrice, onUntrack, isLoadingPrice }) => {
  return (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{car.make} {car.model} ({car.year})</Text>
      {isLoadingPrice ? (
        <ActivityIndicator size="small" />
      ) : (
        <Text style={styles.itemPrice}>
          Current Price: {currentPrice ? `$${currentPrice}` : 'N/A'}
        </Text>
      )}
      <Button title="Untrack" onPress={onUntrack} color="#ff6347" />
    </View>
  );
};

const TrackingScreen = () => {
  const navigation = useNavigation<TrackingScreenNavigationProp>();
  const { trackedCars, trackedCarDetails, removeTrackedCar, fetchTrackedCarDetails } = useTrackingStore();
  const [prices, setPrices] = useState<{ [carId: string]: PriceUpdate }>({});
  const [loadingPrices, setLoadingPrices] = useState<{ [carId: string]: boolean }>({});

  useEffect(() => {
    // Fetch details for any tracked cars that might not have them (e.g., on app load)
    fetchTrackedCarDetails();
  }, [fetchTrackedCarDetails]);

  const fetchPrice = useCallback(async (carId: string) => {
    setLoadingPrices(prev => ({ ...prev, [carId]: true }));
    const priceUpdate = await MockPriceService.getCurrentPrice(carId);
    if (priceUpdate) {
      setPrices(prev => ({ ...prev, [carId]: priceUpdate }));
    }
    setLoadingPrices(prev => ({ ...prev, [carId]: false }));
  }, []);

  useEffect(() => {
    trackedCars.forEach(tc => {
      if (trackedCarDetails[tc.carId] && !prices[tc.carId]) {
        fetchPrice(tc.carId);
      }
    });
  }, [trackedCars, trackedCarDetails, prices, fetchPrice]);

  const handleRefreshPrices = () => {
    setPrices({}); // Clear old prices
    setLoadingPrices({});
    trackedCars.forEach(tc => {
      if (trackedCarDetails[tc.carId]) {
        fetchPrice(tc.carId);
      }
    });
  };

  if (useTrackingStore.getState().isLoading && !Object.keys(trackedCarDetails).length) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Loading tracked car details...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Tracked Cars</Text>
        <Button title="Refresh Prices" onPress={handleRefreshPrices} />
      </View>
      {trackedCars.length === 0 ? (
        <Text style={styles.emptyText}>You are not tracking any cars yet.</Text>
      ) : (
        <FlatList
          data={trackedCars}
          keyExtractor={(item) => item.carId}
          renderItem={({ item }) => {
            const carDetail = trackedCarDetails[item.carId];
            if (!carDetail) return null; // Or a placeholder
            return (
              <TrackedCarItem
                car={carDetail}
                currentPrice={prices[item.carId]?.currentPrice}
                onUntrack={() => removeTrackedCar(item.carId)}
                isLoadingPrice={loadingPrices[item.carId] || false}
              />
            );
          }}
        />
      )}
      <TouchableOpacity
        style={styles.discoverButton}
        onPress={() => navigation.navigate('MockCarList')}
      >
        <Text style={styles.discoverButtonText}>Discover & Track New Cars</Text>
      </TouchableOpacity>
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 5,
    elevation: 2, // for Android shadow
    shadowColor: '#000', // for iOS shadow
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
    color: 'green',
    marginBottom: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  discoverButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  discoverButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TrackingScreen;
