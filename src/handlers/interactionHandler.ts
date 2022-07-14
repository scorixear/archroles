import { ApplicationCommandPermissionData, ButtonInteraction, CommandInteraction, Interaction, SelectMenuInteraction } from 'discord.js';
import { CommandInteractionHandle } from '../model/CommandInteractionHandle';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';
import Register from '../commands/register';
import Unregister from '../commands/unregister';
import LinkRole from '../commands/linkRole';
import UnlinkRole from '../commands/unlinkRole';
import ShowRoles from '../commands/showLinkedRoles';
import { Logger, WARNINGLEVEL } from '../helpers/logger';
import AddDefaultRole from '../commands/addDefaultRole';
import RemoveDefaultRole from '../commands/removeDefaultRole';
import SetBypassRole from '../commands/setBypassRole';
import ShowBypassRole from '../commands/showBypassRole';
import ShowDefaultRoles from '../commands/showDefaulRoles';
import ToggleRoleRemoval from '../commands/toggleRoleRemoval';

export default class InteractionHandler {
  private commandInteractions: CommandInteractionHandle[];
  constructor() {
    this.commandInteractions = [
      new AddDefaultRole(),
      new LinkRole(),
      new Register(),
      new RemoveDefaultRole(),
      new SetBypassRole(),
      new ShowBypassRole(),
      new ShowDefaultRoles(),
      new ShowRoles(),
      new ToggleRoleRemoval(),
      new UnlinkRole(),
      new Unregister(),
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
      if(guild.id !== config.archDiscordId) {
        await rest.put(Routes.applicationGuildCommands(process.env.CLIENTID??"", guild.id), {body: commands})
        Logger.Log('Successfully registered application commands for guild', WARNINGLEVEL.INFO, guild.name);
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
      Logger.Error(`Error handling interaction ${interaction.id}`, err, WARNINGLEVEL.ERROR);
    }

  }
}