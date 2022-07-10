import fs from 'fs';
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;

export default {
  botPrefix: "/",
  version: version,
  archDiscordId: "",
  archKDiscordId: "",
  archRequiredRoles: [["", ""]],
  archKRoles: [""],
  bypassRole: ""
};