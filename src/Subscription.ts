
type NoArgFn = () => void;

export type TearDownLogic
  = NoArgFn
  | {  unsubscribe: NoArgFn }
  | void;

export class Subscription {

  // A flag to indicate whether this Subscription has already been unsubscribed.
  public closed: boolean;

  // Our main state - an array of functions to be called on unsubscribe()
  private tearDownList: Array<NoArgFn>;

  private static EMPTY_FN: NoArgFn = () => { /* empty */ };
  public static EMPTY: Subscription = new Subscription(Subscription.EMPTY_FN);

  constructor(unsubscribe: NoArgFn | undefined) {
    this.closed = false;
    this.tearDownList = unsubscribe ? [ unsubscribe ] : [];
  }

  // Adds a tear down to be called during the unsubscribe() of this Subscription.
  //
  // If the tear down being added is a subscription that is already unsubscribed, is the same reference add
  // is being called on, or is Subscription.EMPTY, it will not be added.
  //
  // If this subscription is already in an closed state, the passed tear down logic will be executed immediately.
  add(teardown: TearDownLogic): Subscription {
    const tearDownFn: NoArgFn | undefined = extractFn(teardown);
    if (tearDownFn !== undefined) {
      if (this.closed) {
        tearDownFn(); // If we are closed, just call the teardown right away
      } else if (tearDownFn !== Subscription.EMPTY_FN && this.tearDownList.indexOf(tearDownFn) === -1) {
          this.tearDownList.push(tearDownFn); // Add if  not the empty object and not already there
      }
    }
    return this;
  }

  // Removes a Subscription from the internal list of subscriptions that will
  // unsubscribe during the unsubscribe process of this Subscription.
  remove(sub: Subscription): void {
    sub.tearDownList.forEach((f: NoArgFn) => {
      this.tearDownList = this.tearDownList.filter((g: NoArgFn) => g !== f);
    });
  }

 // Disposes the resources held by the subscription. May, for instance, cancel an ongoing Observable execution
 // or cancel any other type of work that started when the Subscription was created.
  unsubscribe(): void {
    if (!this.closed) {
      this.tearDownList.forEach((f: NoArgFn) => f());
      this.closed = true;
    }
  }
}

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
