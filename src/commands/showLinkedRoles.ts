import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction } from 'discord.js';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

export default class ShowLinkedRoles extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    super(
      'showlinkedroles',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.showLinkedRoles.description, [config.botPrefix]),
      'showlinkedroles',
      'General',
      'showlinkedroles',
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
      const guilds = await sqlHandler.getLinkedRoles(interaction.guild?.id);
      const guildsText = guilds
        .map((g) => `${g.archName} <> <@&${g.roleid}>`)
        .sort((a, b) => a.localeCompare(b))
        .join('\n');
      MessageHandler.reply({
        interaction,
        title: LanguageHandler.language.commands.showLinkedRoles.success.title,
        description: guildsText
      });
      Logger.info(`${interaction.user.tag} showed roles on guild ${interaction.guild?.name}`);
    } catch (err) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.showLinkedRoles.error.internal_error_title,
        description: LanguageHandler.language.commands.showLinkedRoles.error.internal_error_description
      });
      Logger.exception(
        `${interaction.user.tag} tried to show roles on guild ${interaction.guild?.name} but it failed`,
        err,
        WARNINGLEVEL.WARN
      );
    }
  }
}
