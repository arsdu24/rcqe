import {Class} from "utility-types";

export type RCommandQEReturnType<C> = C extends RCommandQE<infer U> ? U : any;

export abstract class RCommandQE<T extends object | void = void> {
    readonly label: string;

    private exec(): T {
        return {} as unknown as T
    }

    protected constructor(readonly queue?: string) {
        this.label = (this.constructor as any).getLabel();
    }

    abstract serialize(): object | Promise<object>;

    static deserialize<X extends object | void, T extends RCommandQE<X>>(this: Class<T>, plain: object): T | Promise<T> {
        return new this(plain as any);
    }

    static getLabel(): string {
        return `RCommandQE-${this.name}`
    }
}
