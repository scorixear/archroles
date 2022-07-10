import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
import SqlHandler from "../handlers/sqlHandler";

declare const sqlHandler: SqlHandler

export default class AddGuild extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandStringOption().setName("arch_discord_role").setDescription(LanguageHandler.language.commands.addGuild.options.arch_discord_role).setRequired(true));
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.addGuild.options.discord_role).setRequired(true));
    super(
      "addguild",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.addGuild.description, [config.botPrefix]),
      "addguild <arch_discord_role> <discord_role>",
      "Moderation",
      "addguild N1ghtmare @N1ghtmare",
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

    const archDiscordRole = interaction.options.getString("arch_discord_role", true);
    const discordRole = interaction.options.getRole("discord_role", true);

    if(await sqlHandler.isGuildRoleEntered(archDiscordRole, discordRole.id)) {
      interaction.reply({content: LanguageHandler.language.commands.addGuild.error.already_entered, ephemeral: true});
      return;
    }

    try {
      await sqlHandler.addGuildRole(archDiscordRole, discordRole.id);
      interaction.reply(await messageHandler.getRichTextExplicitDefault({
        guild: interaction.guild??undefined,
        author: interaction.user,
        title: LanguageHandler.language.commands.addGuild.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.addGuild.success.description, [archDiscordRole, discordRole.id]),
        color: 0x00ff00,
      }));
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.addGuild.error.internalError, ephemeral: true});
    }
  }
}