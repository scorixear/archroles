import dotenv from 'dotenv';
import { IntervalHandlers } from './handlers/intervalHandlers';
import SqlHandler from './handlers/sqlHandler';
import { DiscordHandler, InteractionHandler, Logger, TwoWayMap, WARNINGLEVEL } from 'discord.ts-architecture';
import { GatewayIntentBits, Partials } from 'discord.js';
import AddDefaultRole from './commands/addDefaultRole';
import LinkRole from './commands/linkRole';
import Register from './commands/register';
import RemoveDefaultRole from './commands/removeDefaultRole';
import SetBypassRole from './commands/setBypassRole';
import ShowBypassRole from './commands/showBypassRole';
import ShowDefaultRoles from './commands/showDefaultRoles';
import ToggleRoleRemoval from './commands/toggleRoleRemoval';
import Unregister from './commands/unregister';
import UnlinkRole from './commands/unlinkRole';
import ShowLinkedRoles from './commands/showLinkedRoles';
import config from './config';
// initialize configuration
dotenv.config();

declare global {
  /* eslint-disable-next-line */
  var discordHandler: DiscordHandler;
  /* eslint-disable-next-line */
  var interactionHandler: InteractionHandler;
  /* eslint-disable-next-line */
  var sqlHandler: SqlHandler;
}
global.interactionHandler = new InteractionHandler(
  new TwoWayMap(new Map()),
  [
    new AddDefaultRole(),
    new LinkRole(),
    new Register(),
    new RemoveDefaultRole(),
    new SetBypassRole(),
    new ShowBypassRole(),
    new ShowDefaultRoles(),
    new ShowLinkedRoles(),
    new ToggleRoleRemoval(),
    new UnlinkRole(),
    new Unregister()
  ],
  /* eslint-disable-next-line */
  () => {}
);

global.discordHandler = new DiscordHandler(
  [Partials.Message, Partials.Channel, Partials.Reaction, Partials.User],
  [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.Guilds
  ]
);

global.sqlHandler = new SqlHandler();

discordHandler.on('interactionCreate', (interaction) => global.interactionHandler.handle(interaction));

process.on('uncaughtException', (err: Error) => {
  Logger.exception('Uncaught Exception', err, WARNINGLEVEL.ERROR);
});
process.on('unhandledRejection', (reason) => {
  Logger.exception('Unhandled Rejection', reason, WARNINGLEVEL.ERROR);
});

sqlHandler.initDB().then(async () => {
  await discordHandler.login(process.env.DISCORD_TOKEN ?? '');
  await interactionHandler.init(
    process.env.DISCORD_TOKEN ?? '',
    process.env.CLIENTID ?? '',
    discordHandler,
    undefined,
    [config.archDiscordId]
  );
  Logger.info('Bot is ready');
  IntervalHandlers.initInterval();
});
