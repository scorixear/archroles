import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class ToggleRoleRemoval extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "toggleroleremoval",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.toggleRoleRemoval.description, [config.botPrefix]),
      "toggleroleremoval",
      "Moderation",
      "toggleroleremoval",
      commandOptions,
      true,
    );
  }

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    try {
      const toggle = await sqlHandler.toggleRoleRemoval(interaction.guild?.id);
      if (toggle) {
        interaction.reply(await messageHandler.getRichTextExplicitDefault({
          guild: interaction.guild??undefined,
          author: interaction.user,
          title: LanguageHandler.language.commands.toggleRoleRemoval.success.on_title,
          description: LanguageHandler.language.commands.toggleRoleRemoval.success.on_description,
          color: 0x00ff00,
        }));
        Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} turned on role removal`, WARNINGLEVEL.INFO);
      } else {
        interaction.reply(await messageHandler.getRichTextExplicitDefault({
          guild: interaction.guild??undefined,
          author: interaction.user,
          title: LanguageHandler.language.commands.toggleRoleRemoval.success.off_title,
          description: LanguageHandler.language.commands.toggleRoleRemoval.success.off_description,
          color: 0xff0000,
        }));
      }
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.toggleRoleRemoval.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to toggle role removal`, err, WARNINGLEVEL.ERROR);
    }
  }
}