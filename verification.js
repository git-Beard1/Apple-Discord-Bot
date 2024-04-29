require("dotenv").config();
const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const keepAlive = require("./server");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.Discord_Bot_Token;

const courses = ["DIT", "DAAA", "DCDF", "DISM"];
const academicYears = ["Y1", "Y2", "Y3"];

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (msg) => {
  if (msg.channel.name === "verify" && !msg.author.bot) {
    // Checks if the message contains course and academic year
    const regex = new RegExp(
      `(${courses.join("|")}) (${academicYears.join("|")})`
    );

    // Set verificationMatch to true if the message matches the regex
    const verificationMatch = msg.content.match(regex) !== null;

    if (verificationMatch) {
      // Split Array
      const separate = msg.content.split(" ");

      // Take the length of the split array
      const length = separate.length;

      // An empty array to store the person's name, course, and academic year
      const personArray = [];

      // Loop through the array and push the last two elements to the personArray
      let i = 1;
      while (i < 3) {
        personArray.push(separate[length - i]);
        i++;
        separate.pop();
      }

      // Join the remaining elements in the array, namely the person's name
      const nametag = separate.join(" ");
      personArray.push(nametag);

      // Reverse array to neatly assign it to the object
      personArray.reverse();

      const member = {
        Name: personArray[0],
        Course: personArray[1],
        AY: personArray[2],
      };

      // Read existing data (if any)
      const memberListFile = "memberList.json";

      let memberList;

      try {
        const data = fs.readFileSync(memberListFile, "utf8");
        memberList = JSON.parse(data) || []; // Parse or create empty array
      } catch (error) {
        memberList = []; // Initialize empty array in case of error
      }

      memberList.push(member);
      const jsonData = JSON.stringify(memberList, null, 2);
      fs.writeFileSync(memberListFile, jsonData, "utf8");

      // Confirming Roles
      const roleVerified = msg.guild.roles.cache.find(
        (role) => role.name === "Verified"
      );

      const roleAYVerified = msg.guild.roles.cache.find(
        (role) => role.name == member.AY
      );

      // If got permission, add the roles
      if (msg.member.permissionsIn(msg.guild).has("MANAGE_ROLES")) {
        msg.member.roles.add(roleVerified);
        msg.member.roles.add(roleAYVerified);
        return;
      }
    }

    // Error Message
    else {
      const embed = new EmbedBuilder()
        .setTitle("Format Error") // Set the embed title
        .setDescription(
          "Please provide your information in the following format:\n`Name Course Academic_Year`"
        )
        .setColor([255, 77, 77]); // Set the embed color to red

      msg.reply({ embeds: [embed] });
    }
  }
});

keepAlive();
client.login(token);
