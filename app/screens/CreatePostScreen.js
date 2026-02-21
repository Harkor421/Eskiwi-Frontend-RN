import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Dimensions, FlatList, Image, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tabs } from 'react-native-collapsible-tab-view';
import Cropper from 'react-native-image-crop-picker';
import AuthContext from '../auth/context';
import AppText from '../components/AppText';
import { BlackButton, GemButton } from '../components/buttons';
import ImagePicker from '../components/imagePicker/ImagePicker';
import { ListItem } from '../components/items';
import colors from '../config/colors';
import routes from '../navigation/routes';
import ApplyForCreator from '../components/imagePicker/ApplyForCreator';


const { width, height } = Dimensions.get('window');
const CROP_SIZE = 1000;
const HEADER_HEIGHT = 100;

const CreatePostScreen = ({ navigation }) => {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [multipleSelection, setMultipleSelection] = useState(false);
  const [pick, setPick] = useState(false);
  const [croppedUri, setCroppedUri] = useState(null);
  const [albums, setAlbums] = useState([]);
  const [selectedAlbumId, setSelectedAlbumId] = useState(null); // Updated state for selected album ID
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation();

  console.log(albums);



  const handleCropper = (uri) => {
    Cropper.openCropper({
      path: uri,
      width: CROP_SIZE,
      height: CROP_SIZE,
      cropping: true,
      compressImageQuality: 1,
      cropperCircleOverlay: false,
    }).then(image => {
      setItems(prevItems => {
        return prevItems.map(item => item.uri === uri ? { uri: image.path } : item);
      });
    }).catch(error => {
      Alert.alert('Error', 'Failed to crop image');
    });
  };

  const toggleMultipleSelection = () => {
    setMultipleSelection(prev => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  const handleSelectAlbum = (albumId) => {
    setSelectedAlbumId(albumId);
    setIsDropdownOpen(false); // Close dropdown after selection
  };
  
  const renderImageItem = useCallback(({ item }) => (
    <View style={styles.imageWrapper}>
      <Image
        source={{ uri: item.uri }}
        style={styles.image}
      />
      <BlackButton
        title={t("createPostScreen.crop")}
        style={styles.cropButton}
        textStyle={styles.cropText}
        icon={require("../assets/crop-icon.png")}
        onPress={() => handleCropper(item.uri)}
      />
    </View>
  ), [handleCropper]);

  const Header = () => (
    <View style = {{flex: 1, backgroundColor: colors.secondary}}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/down-arrow.png")} style={styles.back} />
        </TouchableOpacity>
        <View style={styles.content}>
          <View style={styles.listItemContainer}>
            <ListItem
              title={t("createPostScreen.headerTitle")}
              subTitle={`@${user.username}`}
              avatar={{ uri: user.avatarUri }}
              avatarSize={40}
            />
          </View>
          <View style={styles.details}>
            <GemButton 
              style={styles.next} 
              iconPosition={"left"}
              title={t("createPostScreen.next")}
              onPress={() => {
                if (items.length > 0) {
                  navigation.navigate(routes.EDIT_POST_DETAILS, { imageUris: items });
                }
              }}
            />
          </View>
        </View>
      </View>
      <View style={styles.selectedImagesContainer}>
        {items.length === 0 ? (
          <View style={styles.placeholderContainer}>
            <Image source={require("../assets/photography-camera-1.png")} style={styles.placeholderImage}/>
            <AppText style={styles.placeholderText}>{t("createPostScreen.addMedia")}</AppText>
          </View>
        ) : (
          <FlatList
            horizontal
            data={items}
            keyExtractor={item => item.uri}
            renderItem={renderImageItem}
            contentContainerStyle={styles.imagePreviewContainer}
            showsHorizontalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );

  const tabBar = () => {
    const selectedAlbum = albums.find(album => album.id === selectedAlbumId);
    return (
      <View style={styles.tabBarContainer}>
        <View style={styles.toolBar}>
          <TouchableOpacity style={styles.libraryButton} onPress={toggleDropdown}>
            <AppText style={styles.libraryText}>
              {selectedAlbum ? selectedAlbum.title : t("createPostScreen.library")}
            </AppText>
            <Image style={{ width: 12, height: 12, marginLeft: 10 }} source={require("../assets/point-down-arrow.png")} />
          </TouchableOpacity>
          <View style={styles.blackButtonsContainer}>
            {multipleSelection ? (
              <GemButton 
                onPress={toggleMultipleSelection}
                icon={require('../assets/check-icon.png')}
                style={styles.blackButton}
              />
            ) : (
              <BlackButton 
                onPress={toggleMultipleSelection}
                icon={require('../assets/check-icon.png')} 
                style={styles.blackButton}
              />
            )}
            <BlackButton 
              icon={require('../assets/camera-icon.png')} 
              style={styles.blackButton}
            />
          </View>
        </View>
  
        {/* Dropdown for Albums */}
        {isDropdownOpen && (
          <View style={styles.dropdownContainer}>
            <FlatList
              data={albums}
              keyExtractor={album => album.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.albumButton} onPress={() => handleSelectAlbum(item.id)}>
                  <AppText style={styles.albumText}>{item.title}</AppText>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.scrollView}
            />
          </View>
        )}
      </View>
    );
  };


    // Conditional rendering based on user role
    if (!user.roles.includes('creator')) {
      return <ApplyForCreator navigation={navigation} />; 
    }
  

  return (
    <Tabs.Container
      renderHeader={() => <Header />}
      headerHeight={HEADER_HEIGHT}
      renderTabBar={tabBar}
    >
      <Tabs.Tab label="Posts" name="Posts">
        <ImagePicker 
          setAlbums={setAlbums} 
          pick={pick} 
          setPick={setPick} 
          setItems={setItems}
          multipleSelection={multipleSelection} 
          toggleMultipleSelection={toggleMultipleSelection} 
          selectedAlbumId={selectedAlbumId}
        />
      </Tabs.Tab>
    </Tabs.Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,  
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    margin: 15,
  },
  placeholderText: {
    fontSize: 25,
    fontFamily: 'GeistMono-Bold',
    color: colors.white,
  },
  placeholderImage:{
    width: 100,
    marginBottom: 10,
    height: 100,
    resizeMode: 'contain',
  },
  headerContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.grayline,
    borderTopColor: colors.grayline,
    width: '100%',
    backgroundColor: colors.secondary,
    marginTop: Platform.OS === 'android' ? 20 : 0, // Add marginTop for Android
},
  back: {
    width: 20,
    height: 20,
    marginRight: "3%",
  },
  listItemContainer: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  details: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  selectedImagesContainer: {
    height: height / 2, // Half of the screen height
    backgroundColor: colors.primary,
  },
  imagePreviewContainer: {
    padding: 10,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  image: {
    borderRadius: 10,
    resizeMode: "cover",
    width: width - 20, // Full screen width
    height: (height / 2) - 10, // Full height of the container
  },
  cropButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    padding: 8,
  },
  cropText: {
    color: colors.white,
  },
  toolBar: {
    flexDirection: 'row',
    paddingHorizontal: '3%',
    paddingVertical: '3%',
    alignItems: 'center',
  },
  libraryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  libraryText: {
    fontSize: 16,
    color: colors.white,
    fontFamily: 'GeistMono-Large-Light',
    fontWeight: '500',
  },
  blackButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  blackButton:{
    marginRight: 8,
  },
  tabBarContainer: {
    backgroundColor: colors.primary,
  },
  dropdownContainer: {
    position: 'absolute',
    top: "70%",
    backgroundColor: colors.secondary,
    width: '50%',
    borderRadius: 8,
    elevation: 2,
    maxHeight: 200, // Set a max height for the dropdown
    marginTop: 5,
  },
  albumButton: {
    padding: 10,

  },
  albumText: {
    color: colors.white,
    fontWeight: 500,
  },
});

export default CreatePostScreen;
