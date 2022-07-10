export default class LanguageHandler {
  public static language = {
    commands: {
      register: {
        description: "Registers you to the discord",
        error: {
          internalError: "An internal error occured. Please try again later.",
          notRegistered: "You are not registered on the ARCH discord.",
        },
        success: {
          title: "Successfully Registered",
          description: "You have been successfully registered to the ARCH Korea discord.",
        }
      },
      unregister: {
        description: "Unregisters you from the discord",
        success: {
          title: "Successfully Unregistered",
          description: "You have been successfully unregistered from the ARCH Korea discord.",
        }
      },
      addGuild: {
        description: "Adds a guild to the database",
        error: {
          already_entered: "This guild is already entered in the database.",
          internalError: "An internal error occured. Please try again later.",
        },
        success: {
          title: "Successfully Linked",
          description: "Successfully linked $0 with <@&$1>.",
        },
        options: {
          arch_discord_role: "The ARCH discord role name",
          discord_role: "The ARCH Korea discord role",
        }
      },
      removeGuild: {
        description: "Removes a guild from the database",
        error: {
          internalError: "An internal error occured. Please try again later.",
        },
        success: {
          title: "Successfully Unlinked",
          description: "Successfully unlinked <@&$0>.",
        },
        options: {
          discord_role: "The ARCH Korea discord role",
        }
      },
      showGuild: {
        description: "Shows all guilds in the database",
        error: {
          internalError: "An internal error occured. Please try again later.",
        },
        success: {
          title: "ARCH Guilds <> ARCH Korea Guilds",
        }
      }
    },
    handlers: {
      command: {
        error: {
          unknown: "This command is unknown. Use `$0help` for a list of commands.",
          generic_error: "There was an Error executing the command `$0$1`.",
          general_format: "Your command is not well formated:\n`$0<Command> [args]`",
          args_format: "Your arguments are not well formated.\n*Hint: Arguments with spaces must be surrounded by one \" and cannot contain any additional \"*",
          params_format: "Your options are not well formated.\n*Hint: Options must start with '--' and __can__ contain one additional argument.*"
        }
      },
      emoji: {
        labels: {
          did_you_mean: "Did you mean",
          synonyms: "Synonyms",
          usage: "React with the shown number to execute that command!"
        }
      },
      permissions: {
        error: "Invalid permissions to use `$0$1`!"
      },
      party: {
        title: "Party Setup",
        description: "This is the Party Setup for the Event I have replied to.",
        partyTitle: "Party #$0"
      }
    },
    messages: {
    },
    general: {
      error: "Error",
      description: "Description",
      example: "Example",
      usage: "Usage",
      reason: "Reason",
      server: "Server",
      user: "User",
      message: "Message",
      title: "Title"
    },
    error: {
      user_mention: "You must mention a user",
      user_not_found: "User not found",
      invalid_permissions: "Invalid permissions",
      invalid_usage: "Invalid usage"
    }
  };

  /**
   * Replaces preset args with values in a string
   * @param input
   * @param args
   * @return the filled string
   */
   public static replaceArgs(input: string, args: string[]) {
    // console.log(input);
    // console.log(args);
    for (let i = 0; i<args.length; i++) {
      input = input.split('$'+i).join(args[i]);
    }
    return input;
  }
}