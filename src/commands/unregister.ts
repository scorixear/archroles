import CommandInteractionHandle from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {ChatInputCommandInteraction, CommandInteraction, GuildMember} from "discord.js";
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

  override async handle(interaction: ChatInputCommandInteraction) {
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
    messageHandler.replyRichText({
      interaction,
      title: LanguageHandler.language.commands.unregister.success.title,
      description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.unregister.success.description, [interaction.guild?.name??""]),
    });
    Logger.Log(`${interaction.user.tag} unregistered on guild ${interaction.guild?.name}`, WARNINGLEVEL.INFO);
  }
}