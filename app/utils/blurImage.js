import React, { useRef, useEffect } from 'react';
import { Image, View, Modal, StyleSheet } from 'react-native';
import ViewShot from 'react-native-view-shot';
import { BlurView } from '@react-native-community/blur';

const BlurredImage = ({ imageUri, onCapture }) => {
  const viewShotRef = useRef(null);
  const [modalVisible, setModalVisible] = React.useState(true);

  const handleCapture = async () => {
    try {
      // Capture the view as an image
      const uri = await viewShotRef.current.capture();
      onCapture(uri); // Return the blurred image URI
    } catch (error) {
      console.error("Error capturing image:", error);
    } finally {
      setModalVisible(false); // Close the modal after capturing
    }
  };

  // useEffect to trigger capture when component mounts
  useEffect(() => {
    handleCapture();
  }, []);

  return (
    <Modal visible={modalVisible} transparent={true}>
      <View style={styles.hiddenContainer}>
        <ViewShot
          ref={viewShotRef}
          style={styles.hiddenContainer}
          captureMode="mount"
          options={{ format: 'jpg', quality: 0.8 }}
        >
          <Image
            source={{ uri: imageUri }}
            style={styles.image}
          />
          {/* Apply blur effect */}
          <BlurView
            style={StyleSheet.absoluteFill}
            blurType="light"   // Adjust the blur type as necessary
            blurAmount={10}    // Adjust blur intensity
          />
        </ViewShot>
      </View>
    </Modal>
  );
};

// Styles
const styles = StyleSheet.create({
  hiddenContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200, // Adjust as necessary
  },
});

// Export the component
export default BlurredImage;
