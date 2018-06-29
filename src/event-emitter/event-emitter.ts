
export type EventFunction = (...args: any[]) => void;

interface IEventListener {
    listenerId: number;
    listener: EventFunction;
}

export class EventEmitter {
    private eventSubscriptions = new Map<string, IEventListener[]>();
    private listenerIdSequence = 1;

    // constructor() {}

    /**
     * on method is for registering with an event name.
     * @param eventName The name of the event you want to register with.
     * @param listener The function that will be triggered when
     * event is emitted.
     */
    public on(eventName: string, listener: EventFunction) {
        if (!this.eventSubscriptions.has(eventName)) {
            this.eventSubscriptions.set(eventName, []);
        }

        const listenerList = this.eventSubscriptions.get(eventName) as IEventListener[];
        listenerList.push({
            listener,
            listenerId: this.listenerIdSequence++,
        });
    }

    /**
     * once method is for registering a event you only want to fire once.
     * @param eventName The name of the event to register with.
     * @param listener The function that will be triggered when
     * event is emitted.
     */
    public once(eventName: string, listener: EventFunction) {
        if (!this.eventSubscriptions.has(eventName)) {
            this.eventSubscriptions.set(eventName, []);
        }

        const listenerId = this.listenerIdSequence++;
        const onceFunc = (...args: any[]) => {
            listener.apply(null, args);

            const currentlistenerList = this.eventSubscriptions.get(eventName) as IEventListener[];
            this.eventSubscriptions.set(
                eventName,
                currentlistenerList.filter((l) => l.listenerId !== listenerId));
        };
        const listenerList = this.eventSubscriptions.get(eventName) as IEventListener[];
        listenerList.push({
            listener: onceFunc,
            listenerId,
        });
    }

    /**
     * A method that allows you to remove a listener.
     * @param eventName The name of the event where the listener needs to be removed
     * @param listener The function that you want removed from the event.
     */
    public removeListener(eventName: string, listener: EventFunction) {
        const listenerList = this.eventSubscriptions.get(eventName);

        if (listenerList !== undefined) {
            const newListenerList = listenerList.filter((l) => l.listener !== listener);
            this.eventSubscriptions.set(eventName, newListenerList);
        }
    }

    /**
     * Gives you back a list of events that have been registered.
     */
    public eventNames(): string[] {
        return Array.from(this.eventSubscriptions.keys());
    }

    /**
     * Clears all event listeners that are registered on this event name.
     * @param eventName The name of the event.
     */
    public removeAllListeners(eventName: string) {
        this.eventSubscriptions.set(eventName, []);
    }

    /**
     * Triggers listeners for the event.
     * @param eventName The event to trigger.
     * @param params The parameters to pass to the listeners
     */
    public emit(eventName: string, ...params: any[]) {
        const listenerList = this.eventSubscriptions.get(eventName) as IEventListener[];

        if (listenerList === undefined) {
            return false;
        }

        for (const l of listenerList) {
            l.listener.apply(null, params);
        }

        return true;
    }
}
