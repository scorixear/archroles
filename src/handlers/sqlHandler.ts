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
      await conn.query('CREATE TABLE IF NOT EXISTS `guildroles` (`archName` VARCHAR(255) NOT NULL, `koreaId` VARCHAR(255) NOT NULL, PRIMARY KEY (`archName`, `koreaId`))');
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
    Logger.Log("Initialized Database", WARNINGLEVEL.INFO);
  }

  public async addGuildRole(archName: string, koreaId: string) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('INSERT INTO `guildroles` (`archName`, `koreaId`) VALUES (?, ?)', [archName, koreaId]);
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async removeGuildRole(koreaId: string) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('DELETE FROM `guildroles` WHERE `koreaId` = ?', [koreaId]);
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async isGuildRoleEntered(archName: string, koreaId: string) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `guildroles` WHERE `archName` = ? OR `koreaId` = ?', [archName, koreaId]);
      return result.length > 0;
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async GetGuildRoles() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `guildroles`');
      const returnValue: {archName: string, koreaId: string}[] = [];
      if(result) {
        for(const row of result) {
          returnValue.push({archName: row.archName, koreaId: row.koreaId});
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