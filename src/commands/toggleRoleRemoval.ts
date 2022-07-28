import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction } from 'discord.js';
import SqlHandler from '../handlers/sqlHandler';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

declare const sqlHandler: SqlHandler;

export default class ToggleRoleRemoval extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    super(
      'toggleroleremoval',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.toggleRoleRemoval.description, [config.botPrefix]),
      'toggleroleremoval',
      'Moderation',
      'toggleroleremoval',
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
      const toggle = await sqlHandler.toggleRoleRemoval(interaction.guild?.id);
      if (toggle) {
        MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.toggleRoleRemoval.success.on_title,
          description: LanguageHandler.language.commands.toggleRoleRemoval.success.on_description
        });
        Logger.info(`${interaction.user.tag} on guild ${interaction.guild?.name} turned on role removal`);
      } else {
        MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.toggleRoleRemoval.success.off_title,
          description: LanguageHandler.language.commands.toggleRoleRemoval.success.off_description,
          color: 0xff0000
        });
      }
    } catch (err) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.toggleRoleRemoval.error.internal_error_title,
        description: LanguageHandler.language.commands.toggleRoleRemoval.error.internal_error_description
      });
      Logger.exception(
        `${interaction.user.tag} on guild ${interaction.guild?.name} failed to toggle role removal`,
        err,
        WARNINGLEVEL.ERROR
      );
    }
  }
}
