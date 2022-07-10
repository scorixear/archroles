import fs from 'fs';
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;

export default {
  botPrefix: "/",
  version,
  archDiscordId: "790198417506828299",
  archKDiscordId: "995681684865421323",
  archRequiredRoles: [["790198459843215362", "960239276476498010"]],
  archKRoles: ["995681996506419280"],
  bypassRole: "995682096532164648"
};