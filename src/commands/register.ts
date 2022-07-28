import config from '../config';
import LanguageHandler from '../handlers/languageHandler';
import { ChatInputCommandInteraction, GuildMember } from 'discord.js';
import { CommandInteractionModel, Logger, MessageHandler, WARNINGLEVEL } from 'discord.ts-architecture';

export default class Register extends CommandInteractionModel {
  constructor() {
    const commandOptions: any[] = [];
    super(
      'register',
      LanguageHandler.replaceArgs(LanguageHandler.language.commands.register.description, [config.botPrefix]),
      'register',
      'General',
      'register',
      commandOptions
    );
  }

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch (err) {
      return;
    }
    const archGuild = await discordHandler.fetchGuild(config.archDiscordId);
    try {
      const archUser = await discordHandler.fetchMember(interaction.user.id, archGuild);
      let isValid = true;
      for (const roles of config.archRequiredRoles) {
        const foundRole = roles.find((r) => archUser.roles.cache.has(r));
        if (!foundRole) {
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        MessageHandler.replyError({
          interaction,
          title: LanguageHandler.language.commands.register.error.not_registered_title,
          description: LanguageHandler.language.commands.register.error.not_registered_description
        });
        Logger.info(
          `${interaction.user.tag} tried to register on guild ${interaction.guild?.name} but was not registered.`
        );
        return;
      }
      try {
        const defaultRoles = await sqlHandler.getDefaultRoles(interaction.guild?.id);
        for (const role of defaultRoles) {
          (interaction.member as GuildMember)?.roles.add(role, 'User Registered via Bot');
        }

        const guildRoles = await sqlHandler.getLinkedRoles(interaction.guild?.id);
        for (const guildRole of guildRoles) {
          if (archUser.roles.cache.find((r) => r.name === guildRole.archName)) {
            await (interaction.member as GuildMember)?.roles.add(guildRole.roleid, 'User Registered via Bot');
          }
        }
        if (archUser.nickname) {
          try {
            await (interaction.member as GuildMember)?.setNickname(archUser.nickname);
          } catch (err) {
            Logger.exception(
              `${interaction.user.tag} tried to set nickname on guild ${interaction.guild?.name} but it failed`,
              err,
              WARNINGLEVEL.WARN
            );
          }
        }
        MessageHandler.reply({
          interaction,
          title: LanguageHandler.language.commands.register.success.title,
          description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.register.success.description, [
            interaction.guild?.name ?? ''
          ])
        });
        Logger.info(`${interaction.user.tag} registered on guild ${interaction.guild?.name}.`);
      } catch (err) {
        MessageHandler.replyError({
          interaction,
          title: LanguageHandler.language.commands.register.error.internal_error_title,
          description: LanguageHandler.language.commands.register.error.internal_error_description
        });
        Logger.exception(
          `${interaction.user.tag} registered on guild ${interaction.guild?.name} but failed to add roles.`,
          err,
          WARNINGLEVEL.WARN
        );
      }
    } catch (error) {
      MessageHandler.replyError({
        interaction,
        title: LanguageHandler.language.commands.register.error.not_registered_title,
        description: LanguageHandler.language.commands.register.error.not_registered_description
      });
      Logger.info(
        `${interaction.user.username} tried to register on guild ${interaction.guild?.name} but was not registered.`
      );
    }
  }
}
