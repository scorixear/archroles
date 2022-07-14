import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class LinkRole extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandStringOption().setName("arch_discord_role").setDescription(LanguageHandler.language.commands.linkRole.options.arch_discord_role).setRequired(true));
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.linkRole.options.discord_role).setRequired(true));
    super(
      "linkrole",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.linkRole.description, [config.botPrefix]),
      "linkrole <arch_discord_role> <discord_role>",
      "Moderation",
      "linkrole N1ghtmare @N1ghtmare",
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

    const archDiscordRole = interaction.options.getString("arch_discord_role", true);
    const discordRole = interaction.options.getRole("discord_role", true);

    if(await sqlHandler.isRoleLinked(archDiscordRole, discordRole.id, interaction.guild?.id)) {
      interaction.reply({content: LanguageHandler.language.commands.linkRole.error.already_entered, ephemeral: true});
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} tried to add role ${archDiscordRole} <> ${discordRole.name} but it was already entered`, WARNINGLEVEL.INFO);
      return;
    }

    try {
      await sqlHandler.linkRole(archDiscordRole, discordRole.id, interaction.guild?.id);
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.linkRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.linkRole.success.description, [archDiscordRole, discordRole.id]),
        color: 0x00ff00,
      }));
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} added role ${archDiscordRole} <> ${discordRole.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.linkRole.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} tried to add role ${archDiscordRole} <> ${discordRole.name} but it failed`, err, WARNINGLEVEL.WARN);
    }
  }
}