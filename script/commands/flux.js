module.exports.config = {
  name: `flux`,
  version: "1.1.0",
  permission: 0,
  credits: "xnil",
  description: "",
  prefix: false,
  premium: true,
  category: "without prefix",
  usage: `flux prompt`,
  cooldowns: 3,
  dependency: {
    "axios": ""
  }
};
module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  const { threadID, messageID } = event;
  const nazrul = args.join(" ");
  
  if (!nazrul) return api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐏𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐏𝐫𝐨𝐦𝐩𝐭 𝐅𝐨𝐫 𝐓𝐡𝐞 𝐢𝐦𝐚𝐠𝐞....", threadID, messageID);
  
  try {
    api.sendMessage("𝐏𝐥𝐞𝐚𝐬𝐞 𝐖𝐚𝐢𝐭 𝐁𝐚𝐛𝐲...😘", threadID, messageID);
    const path = __dirname + `/cache/tina.png`;

    const response = await axios.get(`https://xnilnew404.onrender.com/xnil/fluxpro?prompt=${nazrul}`, { responseType: "arraybuffer" });

    if (!response.data.image) {
      return api.sendMessage("Error: Image generation failed. Please try again later.", threadID, messageID);
    }

    fs.writeFileSync(path, Buffer.from(response.data.image, "utf-8"));
    api.sendMessage({
      body: "𝐈𝐦𝐚𝐠𝐞 𝐆𝐞𝐧𝐞𝐫𝐚𝐭𝐞𝐝 𝐒𝐮𝐜𝐜𝐞𝐬𝐬𝐟𝐮𝐥",
      attachment: fs.createReadStream(path),
    }, threadID, () => fs.unlinkSync(path), messageID);

  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, threadID, messageID);
  }
};
