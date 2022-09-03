import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction } from 'discord.js';
import SqlHandler from '../handlers/sqlHandler';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

declare const sqlHandler: SqlHandler;

export default class ShowDefaultRoles extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    super(
      'showdefaultroles',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.showDefaultRoles.description, [config.botPrefix]),
      'showdefaultroles',
      'Moderation',
      'showdefaultroles',
      commandOptions
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }

    try {
      const defaultRoles = await sqlHandler.getDefaultRoles(interaction.guild?.id);
      const defaultRolesText = defaultRoles.map((role) => `<@&${role}>`).join('\n');
      MessageHandler.reply({
        interaction,
        title: LanguageHandler.language.commands.showDefaultRoles.success.title,
        description: defaultRolesText
      });
      Logger.info(`${interaction.user.tag} on guild ${interaction.guild?.name} showed default roles`);
    } catch (err) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.showDefaultRoles.error.internal_error_title,
        description: LanguageHandler.language.commands.showDefaultRoles.error.internal_error_description
      });
      Logger.exception(
        `${interaction.user.tag} on guild ${interaction.guild?.name} failed to show default roles`,
        err,
        WARNINGLEVEL.ERROR
      );
    }
  }
}
