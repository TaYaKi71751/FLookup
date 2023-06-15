// run at Breakpoint focused on `fetchTweetDetail`
// Developer tools -> Network -> Filter URLs (Following) -> Stack Trace -> fetchTweetDetail
(async (tweet_id) => {
  const focalTweet = [];
  const focalTweetAuthor = [];
  const conversations = [];
  let cursor = undefined;
  let count = 20;
  let data_cursor = '';
  function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
  const fetchTweetDetail = async (tweet_id, cursor) => {
    console.log({ tweet_id, cursor, count });
    const results = await e.graphQL(
      s(),
      {
        focalTweetId: tweet_id,
        cursor,
        referrer: o,
        controller_data: n,
        rux_context: u,
        with_rux_injections: c,
        includePromotedContent: !0,
        withCommunity: t.isTrue('c9s_enabled'),
        withQuickPromoteEligibilityTweetFields: !0,
        withBirdwatchNotes: t.isTrue('responsive_web_birdwatch_consumption_enabled'),
        ...(0, a.d)(t),
        withVoice: t.isTrue('voice_consumption_enabled'),
        withV2Timeline: t.isTrue(
          'graphql_timeline_v2_query_threaded_conversation_with_injections'
        ),
        isReaderMode: r
      },
      d
    );
    console.log(results);
    return results;
  }

  let data = undefined;

  do {
    await sleep(1000);
    try {
      data = await fetchTweetDetail(tweet_id, cursor, count);
    } catch (e) {
      console.error(e.toString());
      if (e.toString().includes("Too Many Requests")) {
        await sleep(2500);
      }
    }
    data.threaded_conversation_with_injections_v2.instructions?.filter((i) => (i.type == 'TimelineAddEntries'))[0]?.entries?.filter((e) => (e.entryId.startsWith('tweet-')))?.map((t) => (t.content.itemContent.tweet_results.result))?.forEach((t) => (focalTweet.push(t)));
    data_cursor = data.threaded_conversation_with_injections_v2.instructions.filter((i) => (i.type == 'TimelineAddEntries'))[0]?.entries?.filter((e) => (e.entryId.startsWith('cursor-bottom-')))[0]?.content?.itemContent?.value;

    console.log({ cursor, data_cursor });

    const getNewConversations = async (data) => {
      const instruction = data.threaded_conversation_with_injections_v2.instructions.filter((i) => (i.type == 'TimelineAddEntries'))[0];
      console.log({ instruction })
      if (!instruction) return;
      const conversationEntries = instruction.entries.filter((e) => (e.entryId.startsWith('conversationthread-')));
      const newConversationEntries = (
        conversationEntries.map((cte) => (
          cte.content.items
            .filter((item) => (item.item.itemContent.tweet_results))
            .map((item) => (console.log(item), item.item.itemContent.tweet_results.result))
        ))
          .filter((cte) => (
            conversations.filter((c) => (
              cte.filter((t) => (
                c.filter((_t) => {
                  _t.rest_id == t.rest_id
                }).length
              ))
            ))
          ))
      );
      console.log({ newConversationEntries });
      return newConversationEntries;
    }
    const ca = await getNewConversations(data);
    console.log({ ca });
    ca.forEach((c) => (console.log({ c }), conversations.push(c)))

    if (typeof data_cursor == 'undefined') break;
    if (!ca.length) break;
    if (`${cursor}` == `${data_cursor}`) {
      if (data.threaded_conversation_with_injections_v2.instructions.filter((i) => (i.type == 'TimelineTerminateTimeline')).length) break;
    }
    cursor = data_cursor;
  } while (typeof cursor != 'undefined')
  const NonSelfConversations = conversations.filter((c) => (c.filter((t) => (focalTweet.filter((_t) => (`${t.core.user_results.result.rest_id}` == `${_t.core.user_results.result.rest_id}`)).length)).length != c.length))
  console.log({ conversations, focalTweet, NonSelfConversations });
})('FOCAL_TWEET_ID_HERE')

