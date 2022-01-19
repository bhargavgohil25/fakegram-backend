import { RequestMethod } from '@nestjs/common';

interface IRoute {
  
}

export const allRoutes = {

  first : { path: '/users/@:userName', method: RequestMethod.GET },
  // { path: '/users/:userid/follow', method: RequestMethod.PUT },
  // { path: '/users/:userid/followinfo', method: RequestMethod.GET },
  // { path: '/users/updateprofile', method: RequestMethod.PATCH },
  // { path: '/users/likedposts', method: RequestMethod.GET },
  // { path: '/posts/', method: RequestMethod.POST },
  // { path: '/posts/like', method: RequestMethod.POST },
  // { path: '/posts/:userid/', method: RequestMethod.GET },
};
