import DiscordHandler from './handlers/discordHandler';
import InteractionHandler from './handlers/interactionHandler';
import dotenv from 'dotenv';
import { IntervalHandlers } from './handlers/intervalHandlers';
import SqlHandler from './handlers/sqlHandler';
import { Logger, WARNINGLEVEL } from './helpers/logger';
// initialize configuration
dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var interactionHandler: InteractionHandler;
  var sqlHandler: SqlHandler;
}
global.interactionHandler = new InteractionHandler();
global.discordHandler = new DiscordHandler();
global.sqlHandler = new SqlHandler();



discordHandler.on('interactionCreate', (interaction)=> global.interactionHandler.handle(interaction));



process.on('uncaughtException', (err: Error) => {
  Logger.Error('Uncaught Exception', err, WARNINGLEVEL.ERROR);
});
process.on('unhandledRejection', (reason) => {
  Logger.Error('Unhandled Rejection', reason, WARNINGLEVEL.ERROR);
});

sqlHandler.initDB().then(async () => {
  await discordHandler.login(process.env.DISCORD_TOKEN??"");
  await interactionHandler.Init();
  Logger.Log('Bot is ready', WARNINGLEVEL.INFO);
  IntervalHandlers.initInterval();
});