import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

export default class ShowGuild extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "showguilds",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.showGuild.description, [config.botPrefix]),
      "showguilds",
      "General",
      "showguilds",
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
      const guilds = await sqlHandler.GetGuildRoles();
      const guildsText = guilds.map(g=>`${g.archName} <> <@&${g.koreaId}>`).sort((a,b)=>a.localeCompare(b)).join("\n");
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.showGuild.success.title,
        description: guildsText,
        color: 0x00ff00,
      }));
      Logger.Log(`${interaction.user.tag} showed guilds`, WARNINGLEVEL.INFO);
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.showGuild.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} tried to show guilds but it failed`, err, WARNINGLEVEL.WARN);
    }
  }
}