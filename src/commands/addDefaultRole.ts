import CommandInteractionHandle from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {ChatInputCommandInteraction, SlashCommandRoleOption} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class AddDefaultRole extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.addDefaultRole.options.discord_role).setRequired(true));
    super(
      "adddefaultrole",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.addDefaultRole.description, [config.botPrefix]),
      "adddefaultrole <discord_role>",
      "Moderation",
      "adddefaultrole @N1ghtmare",
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
      await sqlHandler.addDefaultRole(interaction.guild?.id, discordRole.id);
      await messageHandler.replyRichText({
        interaction,
        title: LanguageHandler.language.commands.addDefaultRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.addDefaultRole.success.description, [discordRole.id]),
      });
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} added default role ${discordRole.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      await messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.addDefaultRole.error.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.addDefaultRole.error.description, [discordRole.id]),
      });
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to add default role ${discordRole.name}`, err, WARNINGLEVEL.ERROR);
    }
  }
}