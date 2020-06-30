import {Class} from "utility-types";

export abstract class RCQEvent {
    readonly label: string;

    protected constructor(readonly queue?: string) {
        this.label = (this.constructor as any).getLabel();
    }

    abstract serialize(): object;

    static deserialize<T extends RCQEvent>(this: Class<T>, plain: object): T {
        return new this(plain as any);
    }

    static getLabel(): string {
        return `RCQEvent-${this.name}`
    }
}
