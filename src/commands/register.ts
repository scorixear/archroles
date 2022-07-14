import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction,  GuildMember} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

export default class Register extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "register",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.register.description, [config.botPrefix]),
      "register",
      "General",
      "register",
      commandOptions,
      false,
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }
    const archGuild = await discordHandler.fetchGuild(config.archDiscordId);
    try {
      const archUser = await discordHandler.fetchMember(interaction.user.id, archGuild);
      let isValid = true;
      for(const roles of config.archRequiredRoles) {
        const foundRole = roles.find(r=>archUser.roles.cache.has(r));
        if(!foundRole) {
          isValid = false;
          break;
        }
      }
      if(!isValid) {
        interaction.reply({content: LanguageHandler.language.commands.register.error.notRegistered, ephemeral: true});
        Logger.Log(`${interaction.user.tag} tried to register on guild ${interaction.guild?.name} but was not registered.`, WARNINGLEVEL.INFO);
        return;
      }
      try {
        const defaultRoles = await sqlHandler.getDefaultRoles(interaction.guild?.id);
        for(const role of defaultRoles) {
          (interaction.member as GuildMember)?.roles.add(role, "User Registered via Bot");
        }

        const guildRoles = await sqlHandler.getLinkedRoles(interaction.guild?.id);
        for(const guildRole of guildRoles) {
          if (archUser.roles.cache.find(r=>r.name === guildRole.archName)) {
            await (interaction.member as GuildMember)?.roles.add(guildRole.roleid, "User Registered via Bot");
          }
        }
        if(archUser.nickname) {
          try {
            await (interaction.member as GuildMember)?.setNickname(archUser.nickname);
          } catch(err) {
            Logger.Error(`${interaction.user.tag} tried to set nickname on guild ${interaction.guild?.name} but it failed`, err, WARNINGLEVEL.WARN);
          }
        }
        interaction.reply(await messageHandler.getRichTextExplicitDefault({
          guild: interaction.guild??undefined,
          author: interaction.user,
          title: LanguageHandler.language.commands.register.success.title,
          description: LanguageHandler.language.commands.register.success.description,
          color: 0x00ff00,
        }));
        Logger.Log(`${interaction.user.tag} registered on guild ${interaction.guild?.name}.`, WARNINGLEVEL.INFO);
      } catch (err) {
        console.log(err);
        interaction.reply({content: LanguageHandler.language.commands.register.error.internalError, ephemeral: true});
        Logger.Error(`${interaction.user.tag} registered on guild ${interaction.guild?.name} but failed to add roles.`, err, WARNINGLEVEL.WARN);
      }
    } catch(error) {
      interaction.reply({content: LanguageHandler.language.commands.register.error.notRegistered, ephemeral: true});
      Logger.Log(`${interaction.user.username} tried to register on guild ${interaction.guild?.name} but was not registered.`, WARNINGLEVEL.INFO);
    }
  }
}