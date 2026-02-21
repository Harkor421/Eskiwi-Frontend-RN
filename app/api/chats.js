import client from './client';


const createChat = async (creator_id) => {
    return await client.post(`/ws/createChat`, {creator_id} );
};

const createRoom = async (id) => {
  const response = await client.post(`/ws/createRoom`, {id: id});
  return response;
};

const getChats = async (page) => {
  return await client.get(`/ws/latestChats/${page}`);
};

const acceptChatRequest = async (chatid) => {
  return await client.post(`/ws/acceptChatReq/${chatid}`);
};

const denyChatRequest = async (chatid) => {
  return await client.delete(`/ws/acceptChatReq/${chatid}`);
};

const getMessages = async (chatid, page) => {
  return await client.get(`/ws/latestMessages/${chatid}/${page}`);
};

const getRequests = async (page) => {
  return await client.get(`/ws/latestRequestChats/${page}`);
};

const sendImage = async (formData) => {
  try {
    const response = await client.post('/ws/uploadWebImage', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    console.error('Error creating post:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default {
  createChat,
  createRoom,
  getChats,
  getMessages,
  sendImage,
  getRequests, 
  acceptChatRequest,
  denyChatRequest,  
};
