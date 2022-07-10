import DiscordHandler from './handlers/discordHandler';
import InteractionHandler from './handlers/interactionHandler';
import dotenv from 'dotenv';
import { IntervalHandlers } from './handlers/intervalHandlers';
// initialize configuration
dotenv.config();

declare global {
  var discordHandler: DiscordHandler;
  var interactionHandler: InteractionHandler;
}
global.interactionHandler = new InteractionHandler();
global.discordHandler = new DiscordHandler();



discordHandler.on('interactionCreate', (interaction)=> global.interactionHandler.handle(interaction));



process.on('uncaughtException', (err: Error) => {
  console.error('Unhandled exception', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection', reason);
});

discordHandler.login(process.env.DISCORD_TOKEN??"").then(async () => {
  await interactionHandler.Init();
  console.log('Arch Attendance Bot live!')
  IntervalHandlers.initInterval();
});