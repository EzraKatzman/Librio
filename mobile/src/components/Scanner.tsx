import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

interface ScannerProps {
  onScan: (isbn: string) => void;
  onClose: () => void;
}

const { width } = Dimensions.get('window');
const scanAreaSize = width * 0.7;

export default function Scanner({ onScan, onClose }: ScannerProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [hasScanned, setHasScanned] = useState(false);
  const [scannedCode, setScannedCode] = useState<string>('');

  useEffect(() => {
    if (!permission?.granted) {
      requestPermission();
    }
  }, [permission]);

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (hasScanned) return;

    const { data } = result;
    const cleanedISBN = data.replace(/[-\s]/g, '');
    
    if (!/^\d{10}(\d{3})?$/.test(cleanedISBN)) {
      return;
    }

    setHasScanned(true);
    setScannedCode(cleanedISBN);
    
    setTimeout(() => {
      onScan(cleanedISBN);
      setHasScanned(false);
      setScannedCode('');
    }, 500);
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.permissionText}>
          Camera permission is required to scan books
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={hasScanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.overlaySection} />
          
          <View style={[styles.middleRow, { height: scanAreaSize }]}>
            <View style={styles.overlaySection} />
            
            <View style={[styles.scanArea, { width: scanAreaSize, height: scanAreaSize }]}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {hasScanned && (
                <View style={styles.successIndicator}>
                  <Text style={styles.successText}>✓</Text>
                </View>
              )}
            </View>
            
            <View style={styles.overlaySection} />
          </View>
          
          <View style={styles.overlaySection}>
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                {hasScanned 
                  ? `Scanned: ${scannedCode}` 
                  : 'Position the barcode within the frame'}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  overlay: {
    flex: 1,
  },
  overlaySection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
  },
  scanArea: {
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#B91C4A',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  successIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
  },
  successText: {
    fontSize: 60,
    color: '#fff',
    fontWeight: 'bold',
  },
  instructionsContainer: {
    padding: 20,
    alignItems: 'center',
  },
  instructionsText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#B91C4A',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});