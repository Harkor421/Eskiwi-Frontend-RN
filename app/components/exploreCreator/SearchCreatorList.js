  import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, StyleSheet, View } from 'react-native';
import userApi from '../../api/user'; // Assuming userApi is the correct path
import colors from '../../config/colors';
import useApi from '../../hooks/useApi';
import ActivityIndicator from '../ActivityIndicator';
import AppText from '../AppText';
import AppButton from '../buttons/AppButton';
import UserPreview from './UserPreview'; // Assuming UserPreview is the correct path

  function SearchCreatorList({ navigation, route }) {
    const searchedUser = route.params;
    const [username, setUsername] = useState(searchedUser);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const flatListRef = useRef(null);
    const { t } = useTranslation('postfeed');

    const { data, error, loading, request: searchUsers } = useApi(() => userApi.searchCreator(username));

    // Fetch users when the page changes
    useEffect(() => {
      searchUsers();
      console.log(data);
    }, [page]);

    // Update users state when new data is received
    useEffect(() => {
      if (data && data.publicusers ) {
        setUsers((prevUsers) => (page === 1 ? data.publicusers : [...prevUsers, ...data.publicusers]));
      }
    }, [data]);

    // Handle refresh action
    const handleRefresh = () => {
      setPage(1); // Reset page to 1
      setUsers([]); // Clear previous users
      searchUsers(); // Fetch new data
    };

    // Function to render each user as a UserPreview
    const renderItem = ({ item }) => (
      <UserPreview user={item} navigation={navigation} />
    );

    return (
      <View style={styles.screen}>
        <ActivityIndicator visible={loading} />
        {error && (
          <>
            <AppText style={styles.errorText}>{t('errorText')}</AppText>
            <AppButton title={t('retryButton')} onPress={searchUsers} />
          </>
        )}
        <FlatList
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={10}
          ref={flatListRef}
          data={users}
          keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
          renderItem={renderItem}
          refreshing={loading}
          onRefresh={handleRefresh}
        />
      </View>
    );
  }

  const styles = StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.primary,
    },
    errorText: {
      color: colors.white,
      textAlign: 'center',
    },
  });

  export default SearchCreatorList;
