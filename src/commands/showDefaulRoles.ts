import CommandInteractionHandle from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {ChatInputCommandInteraction, CommandInteraction} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class ShowDefaultRoles extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "showdefaultroles",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.showDefaultRoles.description, [config.botPrefix]),
      "showdefaultroles",
      "Moderation",
      "showdefaultroles",
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
      const defaultRoles = await sqlHandler.getDefaultRoles(interaction.guild?.id);
      const defaultRolesText = defaultRoles.map(role => `<@&${role}>`).join("\n");
      messageHandler.replyRichText({
        interaction,
        title: LanguageHandler.language.commands.showDefaultRoles.success.title,
        description: defaultRolesText,
      });
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} showed default roles`, WARNINGLEVEL.INFO);
    } catch(err) {
      messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.showDefaultRoles.error.internal_error_title,
        description: LanguageHandler.language.commands.showDefaultRoles.error.internal_error_description,
      });
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to show default roles`, err, WARNINGLEVEL.ERROR);
    }
  }
}