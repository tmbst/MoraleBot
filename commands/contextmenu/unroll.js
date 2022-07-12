const { twitterBearerToken } = require("../../config.json");
const { ContextMenuCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require("discord.js");
const needle = require('needle');

module.exports = {

  cooldown: 3,
  data: new ContextMenuCommandBuilder()
    .setName("unroll_twitter_thread")
    .setType(3),

  /**
   * Wrapper for unroll functionality.
   * Initiated by user command.
   * Parses discord comment to identify tweet id from tweet URL.
   *
   * @param {Object} interaction Discord interaction object initiated by user command.
   */
  async execute(interaction) {
    const tweetMessage = interaction.targetMessage;
    if (tweetMessage.hasThread) {
      interaction.reply("That message already has a thread.");
      return;
    } else if (tweetMessage.channel.type != "GUILD_TEXT") {
      interaction.reply("You can't use that command in this channel.");
      return;
    }
    const messageWords = tweetMessage.content.split(' ');
  	for (const word of messageWords) {
  		if (word.includes("twitter.com")) {
        const urlTokens = word.split('?')[0].split('/');
        const tweetId = urlTokens[urlTokens.length - 1];
        await this.unroll(tweetId, interaction);
        return;
      }
    }
    const response = "Couldn't find a tweet in that message.";
    interaction.reply(response);
  },

  /**
   * Prints each tweet in a twitter thread into a new discord thread.
   *
   * Each tweet only refers to the previous tweet in the thread.
   * So, we get the details for the provided tweet,
   * then query for the last tweet in the thread,
   * then begin printing the thread.
   *
   * If there is only one tweet in the thread, we don't print it
   * because Discord automatically provides an embed for single tweets.
   *
   * @param {String} tweetId Id of a tweet in a thread to be unrolled.
   * @param {Object} interaction Discord interaction relating to a channel
   * in which to create a new Discord thread.
   */
  async unroll(tweetId, interaction) {
    let response = "";
		const tweet = await this.getTweet(tweetId);
    const tweetDetails = tweet.body.data[0];
    const authorDetails = await this.getAuthorDetails(tweetDetails.author_id);
    const lastTweetDetails = await this.queryLastTweet(tweetDetails);
    if (!lastTweetDetails) response += "Couldn't find the whole thread since it's more than a week old.\n";
    const rootTweetDetails = lastTweetDetails ? lastTweetDetails : tweetDetails;
    if (!this.getReferencedTweetId(rootTweetDetails)) {
      response += "Nothing to unroll. That's the whole thread!";
      interaction.reply(response);
      return;
    }
    const unrollThread = await interaction.targetMessage.startThread({
      name: "Twitter Thread Unrolled",
      autoArchiveDuration: 1440
    });
    response += "Unrolling Thread!";
    interaction.reply(response);
    this.printTweet(rootTweetDetails.id, unrollThread, authorDetails, true);
  },

  /**
   * Looks up details for a tweet.
   * Returns full response object because attachments are not included in tweet details object.
   *
   * @param {String} tweetId Id of a tweet to look up.
   * @return {Object} Twitter API tweet lookup response object.
   */
  async getTweet(tweetId) {
    const endpointURL = "https://api.twitter.com/2/tweets?ids=";
    const params = {
      "ids": tweetId,
      "tweet.fields": "referenced_tweets,author_id,conversation_id",
      "expansions": "attachments.media_keys",
      "media.fields": "url,type"
    };
  	return await needle('get', endpointURL, params, {
  		headers: {
  			"User-Agent": "v2TweetLookupJS",
  			"authorization": `Bearer ${twitterBearerToken}`
  		}
  	});
  },

  /**
   * Looks up details for a twitter user.
   *
   * @param {String} userId Id of a user to look up.
   * @return {Object} The details of the provided user.
   */
  async getAuthorDetails(userId) {
  	const endpointURL = "https://api.twitter.com/2/users?ids=";
  	const params = {
      "ids": userId,
      "user.fields": "profile_image_url"
    };
  	const response = await needle('get', endpointURL, params, {
  		headers: {
  			"User-Agent": "v2UserLookupJS",
  			"authorization": `Bearer ${twitterBearerToken}`
  		}
  	});
    return response.body.data[0];
  },

  /**
   * Queries to find the last tweet in a thread.
   * Due to Twitter API behavior, can only find tweets from the last week.
   *
   * @param {Object} tweet Twitter API tweet lookup response object.
   * @return {Object} The details of the last tweet in a thread that includes the provided tweet.
   */
  async queryLastTweet(tweet) {
    const endpointURL = "https://api.twitter.com/2/tweets/search/recent";
  	const params = {
  			'query': `from:${tweet.author_id} to:${tweet.author_id} conversation_id:${tweet.conversation_id}`,
        "tweet.fields": "referenced_tweets"
  	}
    const response = await needle('get', endpointURL, params, {
  		headers: {
  			"User-Agent": "v2RecentSearchJS",
  			"authorization": `Bearer ${twitterBearerToken}`
  		}
  	});
    return response.body.data ? response.body.data[0] : null;
  },

  /**
   * Gets details for a tweet of a given id,
   * If the given tweet is not a quote tweet,
   * enqueues recursive calls to print referenced tweets,
   * Then prints the given tweet.
   *
   * If the initial id is the last tweet in a thread, the entire thread will be printed.
   *
   * @param {String} tweetId The id of the tweet to print.
   * @param {Object} unrollThread The channel to print the thread in.
   * @param {Object} [authorDetails] Details on the author of the twitter thread.
   * @param {boolean} [isNotQuoteTweet] Whether or not tweetId refers to a quote tweet.
   */
  async printTweet(tweetId, unrollThread, authorDetails, isNotQuoteTweet) {
    const tweet = await this.getTweet(tweetId);
    const attachments = tweet.body.includes;
    const tweetDetails = tweet.body.data[0];
    if (!authorDetails || tweetDetails.author_id != authorDetails.id) {
      authorDetails = await this.getAuthorDetails(tweetDetails.author_id);
    }
    if (isNotQuoteTweet) {
      const parentTweetId = this.getReferencedTweetId(tweetDetails, 'replied_to');
      const quoteTweetId = this.getReferencedTweetId(tweetDetails, 'quoted');
      if (parentTweetId) await this.printTweet(parentTweetId, unrollThread, authorDetails, true);
      if (quoteTweetId) await this.printTweet(quoteTweetId, unrollThread);
    }
    tweetEmbed = this.formatMessage(authorDetails, tweetDetails, attachments);
    unrollThread.send({ embeds: [tweetEmbed] });
  },

  /**
   * Checks if a tweet refers to other tweets.
   *
   * Types of referenced tweets are 'retweeted', 'replied_to', and 'quoted'.
   * Finds either 'replied_to' or 'quoted' by default.
   *
   * @param {Object} tweetDetails Details about a tweet.
   * @param {String} [referenceType] A type of reference to look for.
   * @return {String} Id of the referenced tweet or false if not found.
   */
  getReferencedTweetId(tweetDetails, referenceType) {
    if (tweetDetails.referenced_tweets) {
      for (referencedTweet of Object.entries(tweetDetails.referenced_tweets)) {
        if ((!referenceType && referencedTweet[1].type != 'retweeted') ||
          referencedTweet[1].type == referenceType) {
          return referencedTweet[1].id;
        }
      }
    }
    return false;
  },

  /**
   * Formats details about a tweet for a discord embed.
   * Discord doesn't allow bots to embed videos or multiple photos.
   *
   * @param {Object} authorDetails Details about a tweet author.
   * @param {Object} tweetDetails Details about a tweet.
   * @param {Object} [attachments] Media attachments of a tweet.
   * @return {Object} Formatted Discord embed with contents of the tweet.
   */
  formatMessage(authorDetails, tweetDetails, attachments) {
    const handle = "@" + authorDetails.username;
    const embed = new MessageEmbed()
      .setColor(1352191)
      .setAuthor({ name: authorDetails.name, iconURL: authorDetails.profile_image_url })
      .addField(handle, tweetDetails.text);
    if (attachments) {
      for (media of attachments.media) {
        if (media.type == "photo") {
          embed.setImage(media.url);
          return embed;
        }
      }
    }
    return embed;
  },
};
