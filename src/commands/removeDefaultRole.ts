import CommandInteractionHandle from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {ChatInputCommandInteraction} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption } from "@discordjs/builders";
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

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    const discordRole = interaction.options.getRole("discord_role", true);

    try {
      await sqlHandler.removeDefaultRole(interaction.guild?.id, discordRole.id);
      messageHandler.replyRichText({
        interaction,
        title: LanguageHandler.language.commands.removeDefaultRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeDefaultRole.success.description, [discordRole.id]),
      });
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} removed default role ${discordRole.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.removeDefaultRole.error.internal_error_title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeDefaultRole.error.internal_error_description, [discordRole.id]),
      });
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to remove default role ${discordRole.name}`, err, WARNINGLEVEL.ERROR);
    }
  }
}