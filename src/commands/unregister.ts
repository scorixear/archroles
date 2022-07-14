import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, GuildMember} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

export default class Unregister extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "unregister",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.unregister.description, [config.botPrefix]),
      "unregister",
      "General",
      "unregister",
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
    try {
      for(const role of (interaction.member as GuildMember)?.roles.cache??[]) {
        await (interaction.member as GuildMember)?.roles.remove(role, "User Unregistered via Bot");
      }
    } catch (err) {
      Logger.Error(`${interaction.user.tag} tried to unregister on guild ${interaction.guild?.name} but it failed`, err, WARNINGLEVEL.WARN);
    }

    interaction.reply(await messageHandler.getRichTextExplicitDefault({
      guild: interaction.guild??undefined,
      author: interaction.user,
      title: LanguageHandler.language.commands.unregister.success.title,
      description: LanguageHandler.language.commands.unregister.success.description,
      color: 0x00ff00,
    }));
    Logger.Log(`${interaction.user.tag} unregistered on guild ${interaction.guild?.name}`, WARNINGLEVEL.INFO);
  }
}