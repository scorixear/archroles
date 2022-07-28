import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction } from 'discord.js';
import { SlashCommandRoleOption } from '@discordjs/builders';
import SqlHandler from '../handlers/sqlHandler';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';
declare const sqlHandler: SqlHandler;

export default class SetBypassRole extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(
      new SlashCommandRoleOption()
        .setName('discord_role')
        .setDescription(LanguageHandler.language.commands.setBypassRole.options.discord_role)
        .setRequired(true)
    );
    super(
      'setbypassrole',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.setBypassRole.description, [config.botPrefix]),
      'setbypassrole <discord_role>',
      'Moderation',
      'setbypassrole @N1ghtmare',
      commandOptions
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    const discordRole = interaction.options.getRole('discord_role', true);

    try {
      await sqlHandler.setBypassRole(interaction.guild?.id, discordRole.id);
      MessageHandler.reply({
        interaction,
        title: LanguageHandler.language.commands.setBypassRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.setBypassRole.success.description, [
          discordRole.id
        ])
      });
      Logger.info(`${interaction.user.tag} on guild ${interaction.guild?.name} set bypass role ${discordRole.name}`);
    } catch (err) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.setBypassRole.error.internal_error_title,
        description: LanguageHandler.replaceArgs(
          LanguageHandler.language.commands.setBypassRole.error.internal_error_description,
          [discordRole.id]
        )
      });
      Logger.exception(
        `${interaction.user.tag} on guild ${interaction.guild?.name} failed to set bypass role ${discordRole.name}`,
        err,
        WARNINGLEVEL.ERROR
      );
    }
  }
}
