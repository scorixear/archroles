import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

export default class Unregister extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    super(
      'unregister',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.unregister.description, [config.botPrefix]),
      'unregister',
      'General',
      'unregister',
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
      for (const role of (interaction.member as GuildMember)?.roles.cache ?? []) {
        await (interaction.member as GuildMember)?.roles.remove(role, 'User Unregistered via Bot');
      }
    } catch (err) {
      Logger.exception(
        `${interaction.user.tag} tried to unregister on guild ${interaction.guild?.name} but it failed`,
        err,
        WARNINGLEVEL.WARN
      );
    }
    MessageHandler.reply({
      interaction,
      title: LanguageHandler.language.commands.unregister.success.title,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.unregister.success.description, [
        interaction.guild?.name ?? ''
      ])
    });
    Logger.info(`${interaction.user.tag} unregistered on guild ${interaction.guild?.name}`);
  }
}
