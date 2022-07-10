import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import { SlashCommandBooleanOption, SlashCommandIntegerOption } from "@discordjs/builders";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import MessageHandler from "../handlers/messageHandler";
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

    if (await sqlHandler.isRegistered(interaction.user.id)) {
      // error message, user already registered
      return;
    }

    // check arch roles
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
        // error message, user not registered on discord
        return;
      }
      if (await sqlHandler.register(interaction.user.id)) {
        try {
          for(const role of config.archKRoles) {
            (interaction.member as GuildMember)?.roles.add(role, "User Registered via Bot");
          }
          // success message
        } catch (err) {
          console.log(err);
          await sqlHandler.unregister(interaction.user.id);
          //error message, internal error
        }
      } else {
        // error message, internal error
      }
    } catch(error) {
      // error message, user not on arch discord
    }
  }
}