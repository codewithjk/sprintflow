

import redis from './client';
export class OnlineUsersService {
    async addUser(redisKey :string,userId : string,user:any) {

      await redis.hset(redisKey, userId, JSON.stringify(user));
    }
  async getOnlineUsers(redisKey :string) {
    return await redis.hvals(redisKey);
  }
    async removeUser(redisKey :string,userId : string) {
        await redis.hdel(redisKey, userId);
    }
}