import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class SetBypassRole extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.setBypassRole.options.discord_role).setRequired(true));
    super(
      "setbypassrole",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.setBypassRole.description, [config.botPrefix]),
      "setbypassrole <discord_role>",
      "Moderation",
      "setbypassrole @N1ghtmare",
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
      await sqlHandler.setBypassRole(interaction.guild?.id, discordRole.id);
      messageHandler.replyRichText({
        interaction,
        title: LanguageHandler.language.commands.setBypassRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.setBypassRole.success.description, [discordRole.id]),
      });
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} set bypass role ${discordRole.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.setBypassRole.error.internal_error_title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.setBypassRole.error.internal_error_description, [discordRole.id]),
      });
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to set bypass role ${discordRole.name}`, err, WARNINGLEVEL.ERROR);
    }
  }
}