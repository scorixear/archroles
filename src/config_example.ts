import fs from 'fs';
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;

export default {
  botPrefix: "/",
  version,
  archDiscordId: "200746010102726657",
  archKDiscordId: "995648794093944832",
  archRequiredRoles: [["790198459843215362", "960239276476498010"]],
  archKRoles: ["995681996506419280"],
  bypassRole: "995682096532164648"
};