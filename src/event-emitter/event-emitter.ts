
export type EventFunction = (...args: any[]) => void;

export class EventEmitter {
    private eventSubscriptions = new Map<string, EventFunction[]>();

    private constructor() {}

    
    public on(eventName: string, listener: EventFunction) {
        if (!this.eventSubscriptions.has(eventName)) {
            this.eventSubscriptions.set(eventName, []);
        }

        const listenerList = this.eventSubscriptions.get(eventName) as EventFunction[];
        listenerList.push(listener);
    }

    public once(eventName: string, listener: EventFunction) {
        const onceFunc = (...args: any[]) => {
            listener.apply(null, args);
            this.removeListener(eventName, onceFunc);
        };

        this.on(eventName, onceFunc);
    }

    public removeListener(eventName: string, listener: EventFunction) {
        const listenerList = this.eventSubscriptions.get(eventName);

        if (listenerList !== undefined) {
            const indexOfListener = listenerList.indexOf(listener);
            if (indexOfListener !== -1) {
                const newList = listenerList.splice(indexOfListener, 1);
                this.eventSubscriptions.set(eventName, newList);
            }
        }
    }

    public eventNames(): string[] {
        return Array.from(this.eventSubscriptions.keys());
    }

    public removeAllListeners(eventName: string) {
        this.eventSubscriptions.set(eventName, []);
    }
}
