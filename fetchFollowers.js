// run at Breakpoint focused on `fetchFollowers`
// Developer tools -> Network -> Filter URLs (Followers) -> Stack Trace -> fetchFollowers
(async (user_id) => {
  const followers = [];
  let cursor = undefined;
  let count = 20;
  let data_cursor = '';
  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  const fetchFollowers = async (user_id, cursor, count) => {
    console.log({ user_id, cursor, count });
    const results = await e.graphQL(
      w(),
      {
        userId: user_id,
        count,
        cursor,
        includePromotedContent: !1,
        ...(0, o.d)(t)
      },
      D('Follow')
    );
    console.log(results);
    return results;
  }

  let data = undefined;

  do {
    await sleep(2500);
    console.log(cursor);
    try {
      data = await fetchFollowers(user_id, cursor, count);
    } catch (e) {
      console.error(e.toString());
      if (e.toString().includes("Too Many Requests")) {
        await sleep(2500);
      }
    }
    console.log(data);
    data_cursor = data.user.result.timeline.timeline.instructions.filter((i) => (i.type == 'TimelineAddEntries'))[0].entries.filter((e) => (e.entryId.startsWith('cursor-bottom-')))[0].content.value;
    console.log({ cursor, data_cursor });
    if (`${cursor}` == `${data_cursor}`) {
      if (data.user.result.timeline.timeline.instructions.filter((i) => (i.type == 'TimelineTerminateTimeline')).length) break;
      count--;
      if (count > 0) continue;
      break;
    }
    cursor = data_cursor;
    data.user.result.timeline.timeline.instructions.filter((i) => (i.type == 'TimelineAddEntries'))[0].entries.filter((e) => (e.entryId.startsWith('user-'))).map((u) => (u.content.itemContent.user_results.result)).forEach((u) => { if (!followers.filter((_u) => (`${_u?.rest_id}` == `${u?.rest_id}`)).length) followers.push(u) });
  } while (typeof cursor != 'undefined')
  console.log(followers);
})('USER_ID_HERE')
