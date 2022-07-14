import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class RemoveDefaultRole extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.removeDefaultRole.options.discord_role).setRequired(true));
    super(
      "removedefaultrole",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeDefaultRole.description, [config.botPrefix]),
      "removedefaultrole <discord_role>",
      "Moderation",
      "removedefaultrole @N1ghtmare",
      commandOptions,
      true,
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    const discordRole = interaction.options.getRole("discord_role", true);

    try {
      await sqlHandler.removeDefaultRole(interaction.guild?.id, discordRole.id);
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.removeDefaultRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeDefaultRole.success.description, [discordRole.id]),
        color: 0x00ff00,
      }));
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} removed default role ${discordRole.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.removeDefaultRole.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to remove default role ${discordRole.name}`, err, WARNINGLEVEL.ERROR);
    }
  }
}