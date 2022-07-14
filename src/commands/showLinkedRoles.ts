import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

export default class ShowLinkedRoles extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "showlinkedroles",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.showLinkedRoles.description, [config.botPrefix]),
      "showlinkedroles",
      "General",
      "showlinkedroles",
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
      const guilds = await sqlHandler.getLinkedRoles(interaction.guild?.id);
      const guildsText = guilds.map(g=>`${g.archName} <> <@&${g.roleid}>`).sort((a,b)=>a.localeCompare(b)).join("\n");
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.showLinkedRoles.success.title,
        description: guildsText,
        color: 0x00ff00,
      }));
      Logger.Log(`${interaction.user.tag} showed roles on guild ${interaction.guild?.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.showLinkedRoles.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} tried to show roles on guild ${interaction.guild?.name} but it failed`, err, WARNINGLEVEL.WARN);
    }
  }
}