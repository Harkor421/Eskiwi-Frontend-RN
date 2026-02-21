import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, Image, StyleSheet, TouchableOpacity, View, Platform, PermissionsAndroid} from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import colors from '../../config/colors';
import {request, PERMISSIONS} from 'react-native-permissions';

const { width } = Dimensions.get('window');
const numColumns = 3;



const ImagePicker = ({ setItems, multipleSelection, setAlbums, selectedAlbumId }) => {
  
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [lastFetchedId, setLastFetchedId] = useState(null);
  const {t} = useTranslation();

  // Create a reference for the FlatList
  const flatListRef = useRef(null);

  const fetchImages = async (albumId) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
        return;
      }

      const options = {
        first: 25,
        mediaType: 'photo',
        sortBy: [MediaLibrary.SortBy.creationTime]
      };

        options.albumId = albumId;


      if (lastFetchedId) {
        options.after = lastFetchedId;
      }

      
      const { assets } = await MediaLibrary.getAssetsAsync(options);

      
      if (assets.length === 0) {
        setHasMore(false);
      } else {
        setImages(prevImages => {
          const allImages = [...prevImages, ...assets];
          const uniqueImages = Array.from(new Set(allImages.map(img => img.id)))
            .map(id => allImages.find(img => img.id === id));
          return uniqueImages;
        });
        setLastFetchedId(assets[assets.length - 1]?.id);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const fetchAlbums = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
        return;
      }

      const albums = await MediaLibrary.getAlbumsAsync();
      setAlbums( albums);
    } catch (error) {
      console.error('Error fetching albums:', error);
    }
  };

  useEffect(() => {
    if (selectedAlbumId) {
      setImages([]);
      setSelected(new Set());
      setLastFetchedId(null);
      setPage(1);
    }
    fetchImages(page, selectedAlbumId);
    fetchAlbums();
  }, [page, selectedAlbumId]);

  const handleEndReached = useCallback(() => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  }, [hasMore]);

  const handleSelectImage = (uri) => {
    if (!multipleSelection) {
      setItems([{ uri }]);
      setSelected(new Set([uri]));
      return;
    }

    setSelected(prevSelected => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(uri)) {
        newSelected.delete(uri);
      } else {
        newSelected.add(uri);
      }
      setItems(Array.from(newSelected).map(uri => ({ uri })));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return newSelected;
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleSelectImage(item.uri)}>
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: item.uri }} />
        {multipleSelection ? (
          <View style={styles.iconContainer}>
            <Image 
              style={styles.check} 
              source={selected.has(item.uri) 
                ? require("../../assets/check-icon-picker.png")
                : require("../../assets/blank-check-icon.png")}
            />
          </View>
        ) : (
          selected.has(item.uri) && (
            <View style={styles.iconContainer}>
              <Image 
                style={styles.check} 
                source={require("../../assets/check-icon-picker.png")}
              />
            </View>
          )
        )}
      </View>
    </TouchableOpacity>
  );

  // Function to scroll to the top
  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  return (
    <View style={{ flex: 1 }}>
      <Tabs.FlatList
        ref={flatListRef}
        style={styles.list}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.columnWrapper}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
      />
      {/* Scroll to Top Button */}
      <TouchableOpacity style={styles.scrollToTopButton} onPress={scrollToTop}>
        <Image source={require("../../assets/up-arrow.png")} style={styles.scrollToTopIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  columnWrapper: {
    justifyContent: 'space-between',
    margin: 8,
  },
  list: {
    flexGrow: 1,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    borderRadius: 10,
    width: (width - 20) / numColumns - 10,
    height: (width - 20) / numColumns - 10,
  },
  check: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  iconContainer: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 15,
    padding: 2,
  },
  scrollToTopButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: colors.primary, // Change to your preferred color
    borderRadius: 25,
    padding: 10,
    elevation: 5,
  },
  scrollToTopIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
  },
});

export default ImagePicker;
