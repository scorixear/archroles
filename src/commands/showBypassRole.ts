import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction } from 'discord.js';
import SqlHandler from '../handlers/sqlHandler';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

declare const sqlHandler: SqlHandler;

export default class ShowBypassRole extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    super(
      'showbypassrole',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.showBypassRole.description, [config.botPrefix]),
      'showbypassrole',
      'Moderation',
      'showbypassrole',
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
      const bypassRole = await sqlHandler.getBypassRole(interaction.guild?.id);
      if (!bypassRole) {
        MessageHandler.replyError({
          interaction,
          title: LanguageHandler.language.commands.showBypassRole.error.no_bypass_role_title,
          description: LanguageHandler.language.commands.showBypassRole.error.no_bypass_role_description
        });
        Logger.info(
          `${interaction.user.tag} on guild ${interaction.guild?.name} tried to show bypass role but there is no bypass role set`
        );
      } else {
        const bypassRoleMember = interaction.guild?.roles.cache.get(bypassRole);
        if (!bypassRoleMember) {
          MessageHandler.replyError({
            interaction,
            title: LanguageHandler.language.commands.showBypassRole.error.bypass_role_not_found_title,
            description: LanguageHandler.language.commands.showBypassRole.error.bypass_role_not_found_description
          });
          Logger.info(
            `${interaction.user.tag} on guild ${interaction.guild?.name} tried to show bypass role but the bypass role was not found`
          );
        } else {
          MessageHandler.reply({
            interaction,
            title: LanguageHandler.language.commands.showBypassRole.success.title,
            description: LanguageHandler.replaceArgs(
              LanguageHandler.language.commands.showBypassRole.success.description,
              [bypassRoleMember.id]
            )
          });
          Logger.info(
            `${interaction.user.tag} on guild ${interaction.guild?.name} showed bypass role ${bypassRoleMember.name}`
          );
        }
      }
    } catch (err) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.showBypassRole.error.internal_error_title,
        description: LanguageHandler.language.commands.showBypassRole.error.internal_error_description
      });
      Logger.exception(
        `${interaction.user.tag} on guild ${interaction.guild?.name} failed to show bypass role`,
        err,
        WARNINGLEVEL.ERROR
      );
    }
  }
}
