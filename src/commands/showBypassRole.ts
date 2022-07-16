import { CommandInteractionHandle } from "../model/CommandInteractionHandle";
import config from '../config';
import LanguageHandler from "../handlers/languageHandler";
import {CommandInteraction} from "discord.js";
import messageHandler from "../handlers/messageHandler";
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
        messageHandler.replyRichErrorText({
          interaction,
          title: LanguageHandler.language.commands.showBypassRole.error.no_bypass_role_title,
          description: LanguageHandler.language.commands.showBypassRole.error.no_bypass_role_description,
        });
        Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} tried to show bypass role but there is no bypass role set`, WARNINGLEVEL.INFO);
      } else {
        const bypassRoleMember = interaction.guild?.roles.cache.get(bypassRole);
        if(!bypassRoleMember) {
          messageHandler.replyRichErrorText({
            interaction,
            title: LanguageHandler.language.commands.showBypassRole.error.bypass_role_not_found_title,
            description: LanguageHandler.language.commands.showBypassRole.error.bypass_role_not_found_description,
          });
          Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} tried to show bypass role but the bypass role was not found`, WARNINGLEVEL.INFO);
        } else {
          messageHandler.replyRichText({
            interaction,
            title: LanguageHandler.language.commands.showBypassRole.success.title,
            description: LanguageHandler.replaceArgs(LanguageHandler.language.commands.showBypassRole.success.description, [bypassRoleMember.id]),
          });
          Logger.Log(`${interaction.user.tag} on guild ${interaction.guild?.name} showed bypass role ${bypassRoleMember.name}`, WARNINGLEVEL.INFO);
        }
      }
    } catch(err) {
      messageHandler.replyRichErrorText({
        interaction,
        title: LanguageHandler.language.commands.showBypassRole.error.internal_error_title,
        description: LanguageHandler.language.commands.showBypassRole.error.internal_error_description,
      });
      Logger.Error(`${interaction.user.tag} on guild ${interaction.guild?.name} failed to show bypass role`, err, WARNINGLEVEL.ERROR);
    }
  }
}