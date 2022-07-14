import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction, Guild, GuildMember, Role} from "discord.js";
import messageHandler from "../handlers/messageHandler";
import { SlashCommandRoleOption, SlashCommandStringOption } from "@discordjs/builders";
import SqlHandler from "../handlers/sqlHandler";
import { Logger, WARNINGLEVEL } from "../helpers/logger";

declare const sqlHandler: SqlHandler

export default class ShowBypassRole extends CommandInteractionHandle {
  constructor() {
    const commandOptions: any[] = [];
    super(
      "showbypassrole",
      () => LanguageHandler.replaceArgs(LanguageHandler.language.commands.showBypassRole.description, [config.botPrefix]),
      "showbypassrole",
      "Moderation",
      "showbypassrole",
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
      const bypassRole = await sqlHandler.getBypassRole(interaction.guild?.id);
      if(!bypassRole) {
        interaction.reply({content: LanguageHandler.language.commands.showBypassRole.error.noBypassRole, ephemeral: true});
        Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} tried to show bypass role but there is no bypass role set`, WARNINGLEVEL.INFO);
      } else {
        const bypassRoleMember = interaction.guild?.roles.cache.get(bypassRole);
        if(!bypassRoleMember) {
          interaction.reply({content: LanguageHandler.language.commands.showBypassRole.error.bypassRoleNotFound, ephemeral: true});
          Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} tried to show bypass role but the bypass role was not found`, WARNINGLEVEL.INFO);
        } else {
          interaction.reply(await messageHandler.getRichTextExplicitDefault({
            guild: interaction.guild??undefined,
            author: interaction.user,
            title: LanguageHandler.language.commands.showBypassRole.success.title,
            description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.showBypassRole.success.description, [bypassRoleMember.id]),
            color: 0x00ff00,
          }));
          Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} showed bypass role ${bypassRoleMember.name}`, WARNINGLEVEL.INFO);
        }
      }
    } catch(err) {
      interaction.reply({content: LanguageHandler.language.commands.showBypassRole.error.internalError, ephemeral: true});
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to show bypass role`, err, WARNINGLEVEL.ERROR);
    }
  }
}