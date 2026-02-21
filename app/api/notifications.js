import client from './client';

const getNotifications = (page) => {
    return client.get(`/notification/getNotifications/${page}`);
};

const getNotificationSettings = () =>{
  return client.get(`/user/getNotificationsSettings`)
}

const updateNotificationSettings = (settings) =>{
  return client.post(`/user/updateNotificationsSettings`, settings)
}


export default {
    getNotifications,
    getNotificationSettings,
    updateNotificationSettings
};
