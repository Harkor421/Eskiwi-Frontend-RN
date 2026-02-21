import React, { useEffect, useRef, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import videosApi from '../api/videos';
import ActivityIndicator from '../components/ActivityIndicator';
import AppButton from '../components/AppButton';
import AppText from '../components/AppText';
import BannerAdComponent from '../components/BannerAd';
import PostItem from '../components/items/PostItem';
import Screen from '../components/Screen';
import colors from '../config/colors';
import useApi from '../hooks/useApi';
function ChannelVideoList({ navigation, channelid }) {
  const [page, setPage] = useState(1);
  const [allVideos, setAllVideos] = useState([]);
  const flatListRef = useRef(null);

  const { data: videos, error, loading, request: loadVideos } = useApi(() => videosApi.getChannelVideos(channelid, page));

  const scrollToTop = () => {
    flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
  };


  const renderItem = ({ item, index }) => {
    if ((index + 1) % 5 === 0) {
      return <BannerAdComponent style={styles.adCard} />;
    } else {
      return <PostItem item={item} navigation={navigation} replace={0} />;
    }
  };
  
  


  useEffect(() => {
    if (videos && videos.videos) {
      setAllVideos((prevVideos) => [...prevVideos, ...videos.videos]);
    }
  }, [videos]);

  useEffect(() => {
    loadVideos();
  }, [page]); // Update when the page or refresh state changes

  // Function to force refresh
  const handleRefresh = () => {
    setPage(1); // Reset page to 1
    setAllVideos([]); // Clear the lt
    setRefresh(!refresh);
  };

  return (
    <Screen style={styles.screen}>
         <ActivityIndicator visible={loading} />
      {error && (
        <>
          <AppText style={styles.errortext}>No se puede conectar a Stardeos.</AppText>
          <AppButton title="Reintentar" onPress={loadVideos} />
        </>
      )}
      <FlatList
        style ={{marginHorizontal: 10}}
        initialNumToRender={10}
        maxToRenderPerBatch={10} // Example value, adjust as needed
        windowSize={10} // Example value, adjust as needed
        ref={flatListRef}
        data={allVideos}
        keyExtractor={(item, index) => item.id.toString() + index} // Ensure unique keys
        renderItem={renderItem}
        onEndReachedThreshold={0.2}
        onEndReached={() => setPage(page + 1)}
        refreshing={loading} // Set refreshing state based on loading status
        onRefresh={handleRefresh} // Call handleRefresh when pull-to-refresh is triggered
      />

    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.primary,
  },
  errortext: {
    color: colors.white,
    textAlign: 'center',
  },
});

export default ChannelVideoList;
