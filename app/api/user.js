import client from './client';

const updateBanner = (data) => {


  return client.post(`/user/updateBanner`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateAvatar = (data) => {

  return client.post(`/user/updateAvatar`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


const searchCreator = (username) => {
  return client.get(`/user/searchCreators/${username}`);
};

const getTopCreators = () => {
  return client.get(`/user/getTopCreators`);
};


const updateDescription = (description) => {
  return client.post(`/user/updateDescription`, {description});
};

const updateUsername = (username) => {
  return client.post(`/user/updateUsername`, {username});
};

const updateDisplayName = (displayName) => {
  return client.post(`/user/updateDisplayName`, {displayName});
};

const uploadExpotoken = (ExpoToken) => {
  return client.post(`/user/ExpoToken`, {ExpoToken});
};

const updateChatRules = (price, rules) => {
  return client.post(`/user/addChatSettings`, {price, rules});
};

const getChatRules = (creator) => {
  return client.get(`/user/getChatSettings/${creator}`);
};


const deleteExpotoken = (expotoken) => {
  return client.delete(`/user/ExpoToken/${expotoken}`);
};

const getTransactionHistory = (page) => {
  return client.get(`/user/getTransactions/${page}`);
};

const createTier = (body) => {
  return client.post(`/user/createSubscriptionTier`, body);
};

const updateTier = (body) => {
  return client.post(`/user/updateSubscriptionTier`, body);
};

const getTiers = (creator) => {
  return client.get(`/user/getSubscriptionTiers/${creator}`);
};

const getTierMembers = (creator, tier, page) => {
  return client.get(`/user/getTierMembers/${creator}/${tier}/${page}`);
};

const getMySubscriptions = (page) => {
  return client.get(`/user/retrieveSubs/${page}`);
};

const getSubEarnings = (page) => {
  return client.get(`/user/getSubEarnings`);
};

const createSubscription = (body) => {
  return client.post(`/user/createSubscriptionTier`, {body});
};

const createSubscriptionToCreator = (body) => {
  return client.post(`/payment/createSubscribeToCreator`, body);
};


const getAvailableSubscription = () => {
  return client.get(`/payment/getAvailableSubscriptionGroup`);
};

const getGemEarnings = () => {
  return client.get(`/user/getEarnings`);
};


const banUser = (creator) => {
  return client.post(`/user/banUser`, {target_id: creator});
};


const deleteAccount = () => {
  return client.delete(`/user/deleteAccount`);
};


// Export the functions as part of an object
export default {
  updateBanner,
  updateAvatar,
  updateDescription,
  uploadExpotoken,
  deleteExpotoken,
  searchCreator,
  getTopCreators,
  updateUsername,
  updateChatRules,
  getChatRules,
  getTransactionHistory,
  createTier,
  updateTier,
  getTiers,
  getTierMembers,
  createSubscription,
  createSubscriptionToCreator,
  getAvailableSubscription,
  getGemEarnings,
  banUser,
  deleteAccount,
  updateDisplayName,
  getMySubscriptions,
  getSubEarnings
};
