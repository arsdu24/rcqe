import { Class } from 'utility-types';

export type RCQueryEReturnType<C> = C extends RCQueryE<infer U> ? U : any;

export abstract class RCQueryE<T extends object> {
  readonly label: string;

  private resolve(): T {
    return ({} as unknown) as T;
  }

  protected constructor(readonly queue?: string) {
    this.label = (this.constructor as any).getLabel();
  }

  serialize(): object {
    return JSON.parse(JSON.stringify(this));
  }

  static deserialize<X extends object, Q extends RCQueryE<X>>(
    this: Class<Q>,
    plain: object,
  ): Q {
    return Object.assign(new this(), plain);
  }

  static getLabel(): string {
    return `RCQueryE-${this.name}`;
  }
}
