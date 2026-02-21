import React, { useContext } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { ListItem } from '../../components/items';
import { GemButton } from '../../components/buttons';
import { useTranslation } from 'react-i18next'; // Import useTranslation
import AuthContext from '../../auth/context';
import { useNavigation } from '@react-navigation/native';
import routes from '../routes';
import useFormattedNumber from '../../hooks/useFormattedNumber';

const CustomDrawerContent = (props) => {
  const { t } = useTranslation(); 
  const {user} = useContext(AuthContext);
  const navigation = useNavigation();
  const formatNumber = useFormattedNumber();

  const handlePress = () =>{
    navigation.navigate("ProfileSettings");
    setTimeout(() => {
      navigation.navigate("AccountSettings");
    }, 300); 

  }

  const renderListItem = () => {
    return (
      <View style={{ marginBottom: "10%" }}>
        <View style = {{paddingHorizontal: "10%"}}>
        <View style={styles.listItemContainer}>
          <ListItem
            title={user.displayName}
            subTitle={`@${user.username}`}
            avatar={{ uri: user.avatarUri }}
            showVerified={true}
            titleStyle={{  fontSize: 16 }}
            subTitleStyle={{  fontSize: 14}}
            navigate={()=> navigation.navigate(routes.CREATOR_DETAILS, user)}
          />
          <TouchableOpacity style={styles.viewMoreContainer} onPress={handlePress}>
            <Image style={styles.viewMore} source={require('../../assets/dots-vertical.png')} />
          </TouchableOpacity>
        </View>
          <GemButton
            style={styles.donateGems}
            icon={require("../../assets/gem-fill-icon.png")}
            iconPosition={"left"}
            title={`${formatNumber(user.gems)} ${t('customDrawerContent.gems')}`}
            onPress={() => {/* Add desired action here */}}
          />
        </View>
      </View>
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userContainer}>
        {renderListItem()}
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 40,
  },
  viewMoreContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    right: "30%",
  },
  viewMore: {
    width: 20,
    height: 20,
    resizeMode: 'contain'
  },
  donateGems: {
    marginTop: 10,
    width: "100%",
  },

});

export default CustomDrawerContent;
