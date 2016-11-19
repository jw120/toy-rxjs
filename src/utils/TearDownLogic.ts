
/**
 *
 * Helper functions used within the library to work with TearDownLogic
 *
 */

export type NoArgFn = () => void;

export type TearDownLogic
  = NoArgFn
  | {  unsubscribe: NoArgFn }
  | void;

// Helper function to extract the unsubscribe function from the TearDownLogic
export function extractFn(teardown: TearDownLogic): NoArgFn | undefined {
  if (typeof teardown === 'function') {
    return teardown;
  }
  if (typeof teardown === 'object') {
    let objTeardown: any = teardown as any;
    if (objTeardown.unsubscribe !== undefined && typeof objTeardown.unsubscribe === 'function') {
      return objTeardown.unsubscribe;
    }
  }
  return undefined;
}

export function callTearDownLogic(teardown: TearDownLogic): void {
  let f: NoArgFn | undefined = extractFn(teardown);
  if (f !== undefined) {
    f();
  }
}
