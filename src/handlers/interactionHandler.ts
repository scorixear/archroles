import { ApplicationCommandPermissionData, ButtonInteraction, CommandInteraction, Interaction, SelectMenuInteraction } from 'discord.js';
import { CommandInteractionHandle } from '../model/CommandInteractionHandle';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';

export default class InteractionHandler {
  private commandInteractions: CommandInteractionHandle[];
  constructor() {
    this.commandInteractions = [
    ];
  }

  public async Init() {
    for(const interaction of this.commandInteractions) {
      if (interaction.Ready) {
        await interaction.Ready;
      }
    }
    const commands = this.commandInteractions.map(command => command.slashCommandBuilder.toJSON());
    const rest = new REST( {version: '9'}).setToken(process.env.DISCORD_TOKEN??"");

    global.discordHandler.getGuilds().forEach(async guild=> {
      if(guild.id === config.archKDiscordId) {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID??"", guild.id), {body: commands})
        console.log('Successfully registered application commands for guild', guild.id);
      }
    });
  }

  public async handle(interaction: Interaction) {
    try {
      if (interaction.isCommand()) {
        const commandInteraction: CommandInteraction = interaction as CommandInteraction;
        const handler = this.commandInteractions.find(interactionHandle => interactionHandle.command === commandInteraction.commandName);
        if (handler) {
          await handler.handle(commandInteraction);
        }
      } else {
        return;
      }
    } catch (err) {
      console.error('Error handling Interaction', err);
    }

  }
}