/* tslint:disable:variable-name */ // Allow Scheduler to start with a capital

/**
 *
 * Stub in place of Scheduler functionality
 *
 */

export type Scheduler = 'sync' | 'async';

export const Scheduler: any = {
  sync: 'sync' ,
  async: 'async'
};

export function isScheduler(x: any): x is Scheduler {
  return x === Scheduler.sync || x === Scheduler.async;
}
