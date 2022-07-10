import mariadb from 'mariadb';
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
      console.log('DB Connection established');
      await conn.query('CREATE TABLE IF NOT EXISTS `registered` (`id` VARCHAR(255) NOT NULL UNIQUE)');
    } catch (error) {
      throw error;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async register(id: string) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('INSERT INTO `registered` (`id`) VALUES (?)', [id]);
    } catch (error) {
      return false;
    } finally {
      if (conn) await conn.end();
    }
    return true;
  }

  public async unregister(id: string) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      await conn.query('DELETE FROM `registered` WHERE `id` = ?', [id]);
    } catch (error) {
      return false;
    } finally {
      if (conn) await conn.end();
    }
    return true;
  }

  public async isRegistered(id: string) {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `registered` WHERE `id` = ?', [id]);
      if (result) {
        return result.length > 0;
      }
    } catch (error) {
      return false;
    } finally {
      if (conn) await conn.end();
    }
  }

  public async getRegistered() {
    let conn;
    try {
      conn = await this.pool.getConnection();
      const result = await conn.query('SELECT * FROM `registered`');
      let returnValue = [];
      if (result) {
        for (const row of result) {
          returnValue.push(row.id);
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