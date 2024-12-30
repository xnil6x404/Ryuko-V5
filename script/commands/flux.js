const axios = require("axios");

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

module.exports.run = async ({ api, event, args }) => {
  try {
    const prompt = args.join(" ");

    // Ensure prompt is provided
    if (!prompt) return api.sendMessage("Please provide a prompt for the image.", event.threadID, event.messageID);
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

    // Send the generated image
    api.sendMessage({
      body: "Here's your image!",
      attachment: await global.utils.getStreamFromURL(data.image), // Ensure this method is implemented or replaced
    }, event.threadID, event.messageID);

  } catch (e) {
    console.error(e);
    api.sendMessage("Error: " + e.message, event.threadID, event.messageID);
  }
};
