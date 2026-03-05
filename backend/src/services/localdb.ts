/**
 * Local in-memory database for development/testing
 * This provides mock data storage without requiring AWS DynamoDB
 */

import logger from '../utils/logger';

interface StorageItem {
  [key: string]: any;
}

class LocalDatabase {
  private storage: Map<string, StorageItem[]> = new Map();

  constructor() {
    this.initializeTables();
  }

  private initializeTables() {
    const tables = [
      'compliquest-users-dev',
      'compliquest-organizations-dev',
      'compliquest-projects-dev',
      'compliquest-controls-dev',
      'compliquest-achievements-dev',
      'compliquest-alerts-dev',
    ];

    tables.forEach(table => {
      this.storage.set(table, []);
    });

    logger.info('Local database initialized with mock tables');
  }

  // Put item
  put(tableName: string, item: StorageItem): Promise<void> {
    if (!this.storage.has(tableName)) {
      this.storage.set(tableName, []);
    }

    const table = this.storage.get(tableName)!;
    const existingIndex = table.findIndex(i => i.id === item.id);

    if (existingIndex >= 0) {
      table[existingIndex] = { ...table[existingIndex], ...item };
    } else {
      table.push(item);
    }

    return Promise.resolve();
  }

  // Get item
  get(tableName: string, key: { id: string }): Promise<StorageItem | undefined> {
    const table = this.storage.get(tableName) || [];
    return Promise.resolve(table.find(i => i.id === key.id));
  }

  // Query items
  query(tableName: string, filter?: (item: StorageItem) => boolean): Promise<StorageItem[]> {
    const table = this.storage.get(tableName) || [];
    const results = filter ? table.filter(filter) : table;
    return Promise.resolve(results);
  }

  // Scan all items
  scan(tableName: string): Promise<StorageItem[]> {
    const table = this.storage.get(tableName) || [];
    return Promise.resolve([...table]);
  }

  // Delete item
  delete(tableName: string, key: { id: string }): Promise<void> {
    const table = this.storage.get(tableName);
    if (table) {
      const index = table.findIndex(i => i.id === key.id);
      if (index >= 0) {
        table.splice(index, 1);
      }
    }
    return Promise.resolve();
  }

  // Clear all data
  clear(): void {
    this.storage.forEach(table => table.length = 0);
    logger.info('Local database cleared');
  }

  // Get table stats
  getStats(): { [key: string]: number } {
    const stats: { [key: string]: number } = {};
    this.storage.forEach((items, tableName) => {
      stats[tableName] = items.length;
    });
    return stats;
  }
}

export const localDb = new LocalDatabase();
export default localDb;
