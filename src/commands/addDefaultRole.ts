import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
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

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    const discordRole = interaction.options.getRole("discord_role", true);
    try {
      await sqlHandler.addDefaultRole(interaction.guild?.id, discordRole.id);
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.addDefaultRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.addDefaultRole.success.description, [discordRole.id]),
        color: 0x00ff00,
      }));
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} added default role ${discordRole.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.addDefaultRole.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to add default role ${discordRole.name}`, err, WARNINGLEVEL.ERROR);
    }
  }
}