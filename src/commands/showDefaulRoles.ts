import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction} from "discord.js";
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

  override async handle(interaction: CommandInteraction) {
    try {
      await super.handle(interaction);
    } catch(err) {
      return;
    }

    try {
      const defaultRoles = await sqlHandler.getDefaultRoles(interaction.guild?.id);
      const defaultRolesText = defaultRoles.map(role => `<@&${role}>`).join("\n");
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.showDefaultRoles.success.title,
        description: defaultRolesText,
        color: 0x00ff00,
      }));
      Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} showed default roles`, WARNINGLEVEL.INFO);
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.showDefaultRoles.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to show default roles`, err, WARNINGLEVEL.ERROR);
    }
  }
}