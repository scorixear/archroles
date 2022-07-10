import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption } from "@discordjs/builders";

export default class RemoveGuild extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.removeGuild.options.discord_role).setRequired(true));
    super(
      "removeguild",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeGuild.description, [config.botPrefix]),
      "removeguild <discord-role>",
      "Moderation",
      "removeguild @N1ghtmare",
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

    const discordRole = interaction.options.getRole("discord_role", true);
    try {
      await sqlHandler.removeGuildRole(discordRole.id);
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.removeGuild.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.removeGuild.success.description, [discordRole.id]),
        color: 0x00ff00,
      }));
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.removeGuild.error.internalError, ephemeral: true});
    }
  }
}