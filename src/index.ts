import DiscordHandler from './handlers/discordHandler';
import InteractionHandler from './handlers/interactionHandler';
import dotenv from 'dotenv';
import { IntervalHandlers } from './handlers/intervalHandlers';
import SqlHandler from './handlers/sqlHandler';
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
  console.error('Unhandled exception', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
});

sqlHandler.initDB().then(async () => {
  await discordHandler.login(process.env.DISCORD_TOKEN??"");
  await interactionHandler.Init();
  console.log('Bot live!')
  IntervalHandlers.initInterval();
});