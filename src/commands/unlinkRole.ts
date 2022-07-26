import CommandInteractionHandle from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {ChatInputCommandInteraction} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption } from "@discordjs/builders";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

export default class UnlinkRole extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    commandOptions.push(new SlashCommandRoleOption().setName("discord_role").setDescription(LanguageHandler.language.commands.unlinkRole.options.discord_role).setRequired(true));
    super(
      "unlinkrole",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.unlinkRole.description, [config.botPrefix]),
      "unlinkrole <discord-role>",
      "Moderation",
      "unlinkrole @N1ghtmare",
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

    const discordRole = interaction.options.getRole("discord_role", true);
    try {
      await sqlHandler.unlinkRole(discordRole.id, interaction.guild?.id);
      messageHandler.replyRichText({
        interaction,
        title: LanguageHandler.language.commands.unlinkRole.success.title,
        description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.unlinkRole.success.description, [discordRole.id]),
      });
      Logger.Log(`${interaction.user.tag} unlinked role ${discordRole.name} on guild ${interaction.guild?.name}`, WARNINGLEVEL.INFO);
    } catch(err) {
      messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.unlinkRole.error.internal_error_title,
        description: LanguageHandler.language.commands.unlinkRole.error.internal_error_description,
      });
      Logger.Error(`${interaction.user.tag} tried to unlink role ${discordRole.name} on guild ${interaction.guild?.name} but it failed`, err, WARNINGLEVEL.WARN);
    }
  }
}