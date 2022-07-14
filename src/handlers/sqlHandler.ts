import mariadb from 'mariadb';
import { Logger, WARNINGLEVEL } from '../helpers/logger';
import config from '../config';

export default class SqlHandler {
  private pool: mariadb.Pool;
  constructor() {
    this.pool = mariadb.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT??"3306", 10),
      database: process.env.DB_DATABASE,
      multipleStatements: true,
      connectionLimit: 5,
    });
  }

  /**
   * Initializes the DataBase
   */
   public async initDB() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('CREATE TABLE IF NOT EXISTS `linkedroles` (`archName` VARCHAR(255) NOT NULL, `roleid` VARCHAR(255) NOT NULL, `guildid` VARCHAR(255) NOT NULL, PRIMARY KEY (`archName`, `roleid`, `guildid`))');
      await conn.query('CREATE TABLE IF NOT EXISTS `defaultroles` (`guildId` VARCHAR(255) NOT NULL, `roleId` VARCHAR(255) NOT NULL, PRIMARY KEY(`guildId`, `roleId`))');
      await conn.query('CREATE TABLE IF NOT EXISTS `bypassroles`(`guildid` VARCHAR(255) NOT NULL, `roleid` VARCHAR(255) NOT NULL, PRIMARY KEY (`guildid`))');
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
    Logger.Log("Initialized Database", WARNINGLEVEL.INFO);
  }

  public async addDefaultRole(guildId: string | undefined, roleId: string) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      const tempResult = await conn.query('SELECT * FROM `defaultroles` WHERE `guildId` = ? AND `roleId` = ?', [guildId, roleId]);
      if(!tempResult || !tempResult[0]) { 
        await conn.query('INSERT INTO `defaultroles` (`guildId`, `roleId`) VALUES (?, ?)', [guildId, roleId]);
      }
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async removeDefaultRole(guildId: string | undefined, roleId: string) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('DELETE FROM `defaultroles` WHERE `guildId` = ? AND `roleId` = ?', [guildId, roleId]);
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async getDefaultRoles(guildId: string | undefined) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `defaultroles` WHERE `guildId` = ?', [guildId]);
      const returnValue: string[] = [];
      if(result) {
        for(const row of result) {
          returnValue.push(row.roleId);
        }
      }
      return returnValue;
    } catch (error) {
      return [];
    } finally {
      if (conn) await conn.end();
    }
  }

  public async getBypassRole(guildId: string | undefined) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `bypassroles` WHERE `guildid` = ?', [guildId]);
      if(result && result[0]) {
        return result[0].roleid;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async setBypassRole(guildId: string | undefined, roleId: string) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      if(await this.getBypassRole(guildId) !== null) {
        await conn.query('UPDATE `bypassroles` SET `roleid` = ? WHERE `guildid` = ?', [roleId, guildId]);
      } else {
        await conn.query('INSERT INTO `bypassroles` (`guildid`, `roleid`) VALUES (?, ?)', [guildId, roleId]);
      }
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async linkRole(archName: string, roleid: string, guildId: string | undefined) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('INSERT INTO `linkedroles` (`archName`, `roleid`, `guildid`) VALUES (?, ?, ?)', [archName, roleid, guildId]);
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async unlinkRole(roleid: string, guildId: string | undefined) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('DELETE FROM `linkedroles` WHERE `roleid` = ? AND `guildid` = ?', [roleid, guildId]);
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async isRoleLinked(archName: string, roleid: string, guildId: string | undefined) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `linkedroles` WHERE (`archName` = ? OR `roleid` = ?) AND (`guildid` = ?)', [archName, roleid, guildId]);
      return result.length > 0;
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async getLinkesRoles(guildId: string | undefined) {
    if (guildId === undefined) {
      throw new Error("GuildId is undefined");
    }
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `guildroles` WHERE `guildid` = ?', [guildId]);
      const returnValue: {archName: string, roleid: string}[] = [];
      if(result) {
        for(const row of result) {
          returnValue.push({archName: row.archName, roleid: row.roleid});
        }
      }
      return returnValue;
    } catch (error) {
      return [];
    } finally {
      if (conn) await conn.end();
    }
  }
}