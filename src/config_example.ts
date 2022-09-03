import fs from 'fs';
const version = JSON.parse(fs.readFileSync('package.json').toString()).version;

export default {
  botPrefix: '/',
  version,
  archDiscordId: '200746010102726657',
  archRequiredRoles: [['790198459843215362', '960239276476498010']]
};
