import { Guild, GuildMember } from "discord.js";
import config from '../config';
import DiscordHandler from "./discordHandler";

declare const discordHandler: DiscordHandler;

export class IntervalHandlers {
  private static archGuild?: Guild;
  private static archKGuild?: Guild;
  public static async initInterval() {
    this.archGuild = await discordHandler.fetchGuild(config.archDiscordId)
    this.archKGuild = await discordHandler.fetchGuild(config.archKDiscordId)
    setInterval(async () => {
      // await this.handleUnregister();
    }, 1000 * 60);
  }

  private static async handleUnregister() {
    if (!this.archGuild || !this.archKGuild) return;
    const removedMembers = [];
    for (const pair of await (this.archKGuild.members.fetch())) {
      const member = pair[1];
      if (member.user.bot) continue;
      if (!member.roles.cache.has(config.bypassRole)) {
        let archMember: GuildMember | undefined;
        if (this.archGuild.members.cache.has(member.user.id)) {
          archMember = this.archGuild.members.cache.get(member.user.id);
        } else {
          try {
            archMember = await this.archGuild.members.fetch(member.user.id);
          } catch {
            if(member.roles.cache.size > 0) {
              try {
                await this.removeRoles(member);
                removedMembers.push(member);
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
    console.log(`Removed ${removedMembers.length} members automatically`);
  }

  private static async removeRoles(member: GuildMember) {
    for (const role of member.roles.cache) {
      await member.roles.remove(role, "Bot removed roles (auto)");
    }
  }
}