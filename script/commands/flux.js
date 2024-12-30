const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "flux",
  version: "1.1.0",
  permission: 0,
  credits: "xnil",
  description: "",
  prefix: false,
  premium: true,
  category: "without prefix",
  usage: "flux prompt",
  cooldowns: 3
};
const getStreamFromURL = async (url) => {
  const response = await axios.get(url, { responseType: "stream" });
  return response.data;
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const prompt = args.join(" ");
    
    if (!prompt) return api.sendMessage("Please provide a prompt for the image.", event.threadID, event.messageID);
    const loadingMessage = await api.sendMessage("Wait a moment... 😁", event.threadID, event.messageID);
    api.setMessageReaction("😘", event.messageID, (err) => {}, true);
    
    const { data } = await axios.get(`https://xnilnew404.onrender.com/xnil/flux?prompt=${prompt}`);

    if (!data.image) {
      return api.sendMessage("Error: Image generation failed. Please try again later.", event.threadID, event.messageID);
    }
    api.setMessageReaction("😇", event.messageID, (err) => {}, true);

    await api.unsendMessage(loadingMessage.messageID);
    
    const imageStream = await getStreamFromURL(data.image);
    
    api.sendMessage({
      body: "Here's your image!",
      attachment: imageStream,
    }, event.threadID, event.messageID);

  } catch (e) {
    api.sendMessage("Error: " + e.message, event.threadID, event.messageID);
  }
};
