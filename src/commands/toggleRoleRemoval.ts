import CommandInteractionHandle from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {ChatInputCommandInteraction, CommandInteraction} from "discord.js";
import messageHandler from "../handlers/messageHandler";
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

  override async handle(interaction: ChatInputCommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    try {
      const toggle = await sqlHandler.toggleRoleRemoval(interaction.guild?.id);
      if (toggle) {
        messageHandler.replyRichText({
          interaction,
          title: LanguageHandler.language.commands.toggleRoleRemoval.success.on_title,
          description: LanguageHandler.language.commands.toggleRoleRemoval.success.on_description,
        });
        Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} turned on role removal`, WARNINGLEVEL.INFO);
      } else {
        messageHandler.replyRichText({
          interaction,
          title: LanguageHandler.language.commands.toggleRoleRemoval.success.off_title,
          description: LanguageHandler.language.commands.toggleRoleRemoval.success.off_description,
          color: 0xff0000,
        });
      }
    } catch(err) {
      messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.toggleRoleRemoval.error.internal_error_title,
        description: LanguageHandler.language.commands.toggleRoleRemoval.error.internal_error_description,
      });
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to toggle role removal`, err, WARNINGLEVEL.ERROR);
    }
  }
}