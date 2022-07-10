import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction,  GuildMember} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import SqlHandler from "../handlers/sqlHandler";

declare const sqlHandler: SqlHandler;

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
        return;
      }
      try {
        for(const role of config.archKRoles) {
          (interaction.member as GuildMember)?.roles.add(role, "User Registered via Bot");
        }
        if(archUser.nickname) {
          (interaction.member as GuildMember)?.setNickname(archUser.nickname);
        }
        interaction.reply(await messageHandler.getRichTextExplicitDefault({
          guild: interaction.guild??undefined,
          author: interaction.user,
          title: LanguageHandler.language.commands.register.success.title,
          description: LanguageHandler.language.commands.register.success.description,
          color: 0x00ff00,
        }));
      } catch (err) {
        console.log(err);
        interaction.reply({content: LanguageHandler.language.commands.register.error.internalError, ephemeral: true});
      }
    } catch(error) {
      interaction.reply({content: LanguageHandler.language.commands.register.error.internalError, ephemeral: true});
    }
  }
}