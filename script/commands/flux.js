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

// Helper function to fetch a stream from a URL using axios
const getStreamFromURL = async (url) => {
  const response = await axios.get(url, { responseType: "stream" });
  return response.data; // Return the stream
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const prompt = args.join(" ");
    
    // Ensure prompt is provided
    if (!prompt) return api.sendMessage("Please provide a prompt for the image.", event.threadID, event.messageID);

    // Send an initial response indicating that the request is being processed
    const loadingMessage = await api.sendMessage("Wait a moment... 😁", event.threadID, event.messageID);
    api.setMessageReaction("😘", event.messageID, (err) => {}, true);

    // Fetch the image from the API using the prompt
    const { data } = await axios.get(`https://xnilnew404.onrender.com/xnil/flux?prompt=${prompt}`);

    // Check if the image exists in the response
    if (!data.image) {
      return api.sendMessage("Error: Image generation failed. Please try again later.", event.threadID, event.messageID);
    }

    // Set a success reaction after the image is ready
    api.setMessageReaction("😇", event.messageID, (err) => {}, true);

    // Unsend the initial "Wait" message
    await api.unsendMessage(loadingMessage.messageID);

    // Fetch the image as a stream and send it
    const imageStream = await getStreamFromURL(data.image);
    
    api.sendMessage({
      body: "Here's your image!",
      attachment: imageStream,
    }, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    api.sendMessage("Error: " + e.message, event.threadID, event.messageID);
  }
};
