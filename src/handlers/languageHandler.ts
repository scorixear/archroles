export default class LanguageHandler {
  public static language = {
    commands: {
      addDefaultRole: {
        description: "Adds a default role when users register",
        options: {
          discord_role: "The role to add to users when they register",
        },
        success: {
          title: "Successfully added default role",
          description: "Added default role <@&$0>",
        },
        error: {
          internalError: "An internal error occured",
        }
      },
      removeDefaultRole: {
        description: "Removes a default role",
        options: {
          discord_role: "The role to remove",
        },
        success: {
          title: "Successfully removed default role",
          description: "Removed default role <@&$0>",
        },
        error: {
          internalError: "An internal error occured",
        }
      },
      setBypassRole: {
        description: "Sets the role that bypasses the moderation system",
        options: {
          discord_role: "The role to set as the bypass role",
        },
        success: {
          title: "Successfully set bypass role",
          description: "Set bypass role <@&$0>",
        },
        error: {
          internalError: "An internal error occured",
        }
      },
      showBypassRole: {
        description: "Shows the bypass role",
        success: {
          title: "Bypass role",
          description: "The bypass role is <@&$0>",
        },
        error: {
          internalError: "An internal error occured",
          noBypassRole: "No bypass role set",
          bypassRoleNotFound: "The bypass role was not found",
        }
      },
      showDefaultRoles: {
        description: "Shows the default roles",
        success: {
          title: "Default roles",
        },
        error: {
          internalError: "An internal error occured",
        }
      },
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
      linkRole: {
        description: "Links roles from ARCH to this discord",
        error: {
          already_entered: "This role is already linked.",
          internalError: "An internal error occured. Please try again later.",
        },
        success: {
          title: "Successfully Linked",
          description: "Successfully linked $0 with <@&$1>.",
        },
        options: {
          arch_discord_role: "The ARCH discord role name",
          discord_role: "The discord role",
        }
      },
      unlinkRole: {
        description: "Unlinks roles from ARCH and this discord",
        error: {
          internalError: "An internal error occured. Please try again later.",
        },
        success: {
          title: "Successfully Unlinked",
          description: "Successfully unlinked <@&$0>.",
        },
        options: {
          discord_role: "The discord role",
        }
      },
      showLinkedRoles: {
        description: "Shows all linked roles",
        error: {
          internalError: "An internal error occured. Please try again later.",
        },
        success: {
          title: "ARCH Roles <> Discord Roles",
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