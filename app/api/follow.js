import client from './client';



const checkFollow = (creator_id) => {
  return client.get(`/user/getUserFollow/${creator_id}`);
};

const follow = async (creator_id) => {
    return await client.post(`/user/followUser`, {creator_id} );
};

const unfollow = async (creator_id) => {
    return await client.delete(`/user/followUser/${creator_id}` );
};

export default {
  follow,
  checkFollow,
  unfollow
};
