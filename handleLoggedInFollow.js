// run at Breakpoint focused on `this._handleLoggedInFollow`
// Developer tools -> Network -> Filter URLs (https://twitter.com/i/api/1.1/friendships/create.json) -> Stack Trace -> this._handleLoggedInFollow
(async (users) => {
  for(let i = 0;i < users.length;i++){
    const user = users[i];
    function sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    async function follow(user){
      try {
        await t(user.rest_id, {
          promotedContent: l,
          isFollowNudge: n
        });
      } catch (e){
        await sleep(1000);
        await follow(user);
      }
    }
    if(user){
      await follow(user);
    }else break;
  }
})('USERS_ARRAY_HERE')
