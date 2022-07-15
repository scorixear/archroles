import { Guild, GuildMember } from "discord.js";
import { Logger, WARNINGLEVEL } from "../helpers/logger";
import config from '../config';
import DiscordHandler from "./discordHandler";

declare const discordHandler: DiscordHandler;

export class IntervalHandlers {
  private static archGuild?: Guild;
  public static async initInterval() {
    this.archGuild = await discordHandler.fetchGuild(config.archDiscordId)
    setInterval(async () => {
      await this.handleUnregister();
    }, 1000 * 60);
  }

  private static async handleUnregister() {
    if (!this.archGuild) return;
    for (const guild of discordHandler.getGuilds()) {
      if(guild[0] !== config.archDiscordId) {
        if (!(await sqlHandler.isRoleRemovalActive(guild[0]))) {
          continue;
        }
        const removedMembers = [];
        const couldNotCatchArchMembers = [];
        const bypassRole = await sqlHandler.getBypassRole(guild[0]);
        for (const pair of await (guild[1].members.fetch())) {
          let member = pair[1];
          if (member.user.bot) continue;
          if (!member.roles.cache.has(bypassRole)) {
            let archMember: GuildMember | undefined;
            member = await member.guild.members.fetch(member.user.id);
            if (this.archGuild.members.cache.has(member.user.id)) {
              archMember = this.archGuild.members.cache.get(member.user.id);
            } else {
              try {
                archMember = await this.archGuild.members.fetch(member.user.id);
              } catch {
                if(member.roles.cache.size > 0) {
                  try {
                    await this.removeRoles(member);
                    couldNotCatchArchMembers.push(member);
                  } catch {}
                }
                continue;
              }
            }
            let isValid = true;
            for (const roles of config.archRequiredRoles) {
              const foundRole = roles.find(r => archMember?.roles.cache.has(r));
              if (!foundRole) {
                isValid = false;
                break;
              }
            }
            if (!isValid) {
              if(member.roles.cache.size > 0) {
                try {
                  await this.removeRoles(member);
                  removedMembers.push(member);
                } catch {}
              }
              continue;
            }
          }
        }
        Logger.Log(`${removedMembers.length} members were removed from guild ${guild[1].name} due to not having required roles.`, WARNINGLEVEL.INFO, removedMembers);
        Logger.Log(`${couldNotCatchArchMembers.length} members were removed from guild ${guild[1].name} due to not being on arch discord.`, WARNINGLEVEL.INFO, couldNotCatchArchMembers);
      }
    }
  }


  private static async removeRoles(member: GuildMember) {
    await member.roles.set([]);
  }
}