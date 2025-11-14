import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet } from 'react-native';
import { useAppStore } from '../store/useAppStore';
import BookPreview from '../components/BookPreview';

export default function HomeScreen({ navigation }: any) {
  const { recentlyScanned, clearRecent } = useAppStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Librio Scanner</Text>
        <Text style={styles.headerSubtitle}>Scan books to add to your library</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => navigation.navigate('Scanner')}
          activeOpacity={0.8}
        >
          <View style={styles.scanIcon}>
            <Text style={styles.scanIconText}>📷</Text>
          </View>
          <Text style={styles.scanButtonText}>Scan Book</Text>
        </TouchableOpacity>

        {recentlyScanned.length > 0 && (
          <View style={styles.recentSection}>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recently Scanned</Text>
              <TouchableOpacity onPress={clearRecent}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.recentList}>
              {recentlyScanned.map((book) => (
                <BookPreview key={book.id} book={book} />
              ))}
            </ScrollView>
          </View>
        )}

        {recentlyScanned.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>📚</Text>
            <Text style={styles.emptyStateText}>No books scanned yet</Text>
            <Text style={styles.emptyStateSubtext}>
              Tap the scan button to add your first book
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F1410',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scanButton: {
    backgroundColor: '#B91C4A',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#B91C4A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  scanIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  scanIconText: {
    fontSize: 40,
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
  },
  recentSection: {
    flex: 1,
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F1410',
  },
  clearText: {
    color: '#B91C4A',
    fontSize: 16,
    fontWeight: '500',
  },
  recentList: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  emptyStateIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F1410',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});