// run at Breakpoint focused on `addToList`
// Developer tools -> Network -> Filter URLs (ListAddMember) -> Stack Trace -> addToList
(async (users,list_id) => {
  for(let i = 0;i < users.length;i++){
    const user = users[i];
    function sleep(milliseconds) {
      return new Promise(resolve => setTimeout(resolve, milliseconds));
    }
    async function addToList(user,list_id){
      try {
        await e.graphQL(c(), {
            listId: list_id,
            userId: user.rest_id,
            ...(0, s.S) (t)
          }, ke).then((e => (0, i.Fv) (e.list, o.Z)))
      } catch (e){
        await sleep(1500);
        await addToList(user,list_id);
      }
    }
    if(user && list_id){
      await addToList(user,list_id);
    }else break;
  }
})('USERS_ARRAY_HERE','LIST_ID_HERE')
