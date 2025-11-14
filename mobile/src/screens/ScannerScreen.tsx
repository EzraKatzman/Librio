import React, { useState } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import Scanner from '../components/Scanner';
import BookPreview from '../components/BookPreview';
import { addBookByISBN } from '../api/books';
import { useAppStore } from '../store/useAppStore';
import { Book } from '../types/book';

export default function ScannerScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scannedBook, setScannedBook] = useState<Book | null>(null);
  const { addScannedBook } = useAppStore();

  const handleScan = async (isbn: string) => {
    setLoading(true);
    setError(null);
    setScannedBook(null);

    try {
      const book = await addBookByISBN(isbn);
      setScannedBook(book);
      addScannedBook(book);
      
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Scanner onScan={handleScan} onClose={handleClose} />

      {loading && (
        <View style={styles.overlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#B91C4A" />
            <Text style={styles.loadingText}>Looking up book...</Text>
          </View>
        </View>
      )}

      {scannedBook && !loading && (
        <View style={styles.overlay}>
          <View style={styles.successCard}>
            <View style={styles.successIcon}>
              <Text style={styles.successIconText}>✓</Text>
            </View>
            <Text style={styles.successTitle}>Book Added!</Text>
            <BookPreview book={scannedBook} />
            <TouchableOpacity style={styles.doneButton} onPress={handleClose}>
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {error && !loading && (
        <View style={styles.overlay}>
          <View style={styles.errorCard}>
            <View style={styles.errorIcon}>
              <Text style={styles.errorIconText}>✕</Text>
            </View>
            <Text style={styles.errorTitle}>Oops!</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={() => setError(null)}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 200,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#1F1410',
  },
  successCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  successIconText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1410',
    textAlign: 'center',
    marginBottom: 16,
  },
  doneButton: {
    backgroundColor: '#B91C4A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  doneButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  errorIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorIconText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F1410',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#B91C4A',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 32,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});