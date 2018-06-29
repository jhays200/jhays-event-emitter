import { EventEmitter } from "../event-emitter";

describe("event-emitter.ts", () => {
    test("once listener only gets hit once", () => {
        const event = "test";
        const onceMockCallback = jest.fn();
        const onMockCallback = jest.fn();
        const testEventEmitter = new EventEmitter();

        testEventEmitter.once(event, onceMockCallback);
        testEventEmitter.on(event, onMockCallback);

        testEventEmitter.emit(event, "Hello");

        // Test both mock functions got called
        expect(onceMockCallback.mock.calls.length).toBe(1);
        expect(onMockCallback.mock.calls.length).toBe(1);
        expect(onceMockCallback).toBeCalledWith("Hello");
        expect(onMockCallback).toBeCalledWith("Hello");

        // Test only one of the callbacks got hit
        testEventEmitter.emit(event, "World");
        expect(onceMockCallback.mock.calls.length).toBe(1);
        expect(onMockCallback.mock.calls.length).toBe(2);
        expect(onMockCallback).toBeCalledWith("World");
    });

    test("removing all listeners prevents event emission", () => {
        const event = "test";
        const callback = jest.fn();

        const testEventEmitter = new EventEmitter();
        testEventEmitter.on(event, callback);

        testEventEmitter.emit(event, "Hello");
        expect(callback).toBeCalledWith("Hello");

        testEventEmitter.removeAllListeners(event);
        testEventEmitter.emit(event, "World");
        expect(callback.mock.calls.length).toBe(1);
    });

    test("remove a specific event listener", () => {
        const ITEM_COUNT = 3;
        const listeners = Array.from({ length: ITEM_COUNT }, () => jest.fn());
        const event = "test";

        const eventEmitter = new EventEmitter();
        for (const l of listeners) {
            eventEmitter.on(event, l);
        }

        eventEmitter.emit(event);

        for (const l of listeners) {
            expect(l).toBeCalled();
        }

        eventEmitter.removeListener(event, listeners[1]);
        eventEmitter.emit(event);
        expect(listeners[0].mock.calls.length).toBe(2);
        expect(listeners[1].mock.calls.length).toBe(1);
    });

    test("multiple arguments with events", () => {
        const event = "test";
        const callback = jest.fn();

        const testEventEmitter = new EventEmitter();
        testEventEmitter.on(event, callback);

        testEventEmitter.emit(event, "Hello", "World", "Hi");
        expect(callback).toBeCalledWith("Hello", "World", "Hi");

        testEventEmitter.emit(event, "Foo");
        expect(callback).toBeCalledWith("Foo");
    });

    test("get event names", () => {
        const ITEM_COUNT = 3;
        const listener = jest.fn();
        const events = Array.from({ length: ITEM_COUNT}, (_, k) => `event${k}`);

        const eventEmitter = new EventEmitter();
        for (const e of events) {
            eventEmitter.on(e, listener);
        }

        const names = eventEmitter.eventNames();
        for (let i = 0; i < names.length; ++i) {
            expect(names[i]).toBe(events[i]);
        }
    });

    test("emit throws error with no listeners", () => {
        const eventEmitter = new EventEmitter();

        expect(() => eventEmitter.emit("error")).toThrowError();
    });
});
