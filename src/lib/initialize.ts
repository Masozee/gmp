import sqlite from './sqlite'; if (typeof window === 'undefined') { sqlite.setupDatabase(); } export default sqlite;
