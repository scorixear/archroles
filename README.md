# ARCH Roles Bot

The Arch Roles Bot provides **role synchronisation** between multiple servers.
A main server provides some means for authentication of users and is the base to expand this authentication to other discord servers.

## Inital Setup
The Bot needs to be invited to the main server. There is no role or integration to setup when inviting.

This bot is then invited to other servers that want to share the same authentication as the main server does.
Integrations for this bot needs to be setup before this is usable as the bot does not provide any role restriction.

## Setting up a secondary server
After inviting the bot, the integrations need to be setup. I recommend to have a separate channel for authentication from users and administrative commands.
All commands except `/register` and `/unregister` are administrative commands and should be forbidden for all users except admins.

# Usage of ARCH Roles

## Before usage
1. Adding a default role
With `/adddefaultrole` you can add a default role such as "Member", which will be added to every user after the successfully register.
You can have multiple default roles.
2. Adding a bypass role
With `/setbypassrole` you can set the bypass role. The bot will then not remove roles from members having this role. This roles does not have to be above other roles
or contain special permissions. Only the existens of this role prevents the bot from removing roles from members.
You can only have one bypass role.
3. Linking other roles
With `/linkrole` you can link roles from the main server to roles on this server. The input here is the string name of the main server role and the actual role on this server.
Note that the string name needs to be exactly right with correct capitalization.
This could be used for guild roles for example.

## During usage
You can turn of role removal for this server with `/toggleroleremoval`. This will stop or start the bot from removing roles from members that are not authenticated on the main server.

## Editing the Usage
- Removing Default Roles `/removedefaultrole`
- Showing Default Roles  `/showdefaultroles`
- Showing Bypass Role `/showbypassrole`
- Removing Linked Roles `/unlinkrole`
- Showing Linked Roles `/showlinkedroles`


# Command Explanation and Usage
| Command | Usage | Example | Explanation |
| ------- | ----- | ------- | ----------- |
| `/adddefaultrole` | `/adddefaultrole <role>` | `/adddefaultrole @Member` | Adds a default role to the server configuration. Every registered user will get this role. Multiple default roles are possible. |
| `/removedefaultrole` | `/removedefaultrole <role>` | `/removedefaultrole @Member` | Removes a previously configured default role from the server configuration. |
| `/showdefaultroles` | `/showdefaultroles` | `/showdefaultroles` | Shows all configured default roles. |
| `/setbypassrole` | `/setbypassrole <role>` | `/setbypassrole @Bypass` | Sets the bypass role of this server. Users with this role won't get their roles removed even if they are not authenticated on the main server anymore. |
| `/showbypassrole` | `/showbypassrole` | `/showbypassrole` | Shows the set bypass role of this server. |
| `/linkrole` | `/linkrole <main-server-role> <role>` | `/linkrole Guild1 @Guild1` | Links a role on the main server to a role on this server. Users with this role on the main server will get the linked role on this server. |
| `/showlinkedroles` | `/showlinkedroles` | `/showlinkedroles` | Shows all linked roles. |
| `/unlinkrole` | `/unlinkrole <role>` | `/unlinkrole @Guild1` | Removes a configuration of linked roles. |
| `/register` | `/register` | `/register` | Registers the executing user. If this user is authenticated on the main server, he will get the default roles and linked roles if applicable. |
| `/unregister` | `/unregister` | `/unregister` | Removes all roles from the user. Does also remove Bypass Roles. |
