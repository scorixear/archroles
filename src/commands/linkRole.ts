import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction, SlashCommandRoleOption, SlashCommandStringOption } from 'discord.js';
import SqlHandler from '../handlers/sqlHandler';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

declare const sqlHandler: SqlHandler;

export default class LinkRole extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(
      new SlashCommandStringOption()
        .setName('arch_discord_role')
        .setDescription(LanguageHandler.language.commands.linkRole.options.arch_discord_role)
        .setRequired(true)
    );
    commandOptions.push(
      new SlashCommandRoleOption()
        .setName('discord_role')
        .setDescription(LanguageHandler.language.commands.linkRole.options.discord_role)
        .setRequired(true)
    );
    super(
      'linkrole',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.linkRole.description, [config.botPrefix]),
      'linkrole <arch_discord_role> <discord_role>',
      'Moderation',
      'linkrole N1ghtmare @N1ghtmare',
      commandOptions
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    const archDiscordRole = interaction.options.getString('arch_discord_role', true);
    const discordRole = interaction.options.getRole('discord_role', true);

    if (await sqlHandler.isRoleLinked(archDiscordRole, discordRole.id, interaction.guild?.id)) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.linkRole.error.already_entered_title,
        description: LanguageHandler.language.commands.linkRole.error.already_entered_description
      });
      Logger.info(
        `${interaction.user.tag} on guild ${interaction.guild?.name} tried to add role ${archDiscordRole} <> ${discordRole.name} but it was already entered`
      );
      return;
    }

    try {
      await sqlHandler.linkRole(archDiscordRole, discordRole.id, interaction.guild?.id);
      MessageHandler.reply({
        interaction,
        title: LanguageHandler.language.commands.linkRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.linkRole.success.description, [
          archDiscordRole,
          discordRole.id
        ])
      });
      Logger.info(
        `${interaction.user.tag} on guild ${interaction.guild?.name} added role ${archDiscordRole} <> ${discordRole.name}`
      );
    } catch (err) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.linkRole.error.internalError_title,
        description: LanguageHandler.language.commands.linkRole.error.internalError_description
      });
      Logger.exception(
        `${interaction.user.tag} on guild ${interaction.guild?.name} tried to add role ${archDiscordRole} <> ${discordRole.name} but it failed`,
        err,
        WARNINGLEVEL.WARN
      );
    }
  }
}
