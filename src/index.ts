import { EventEmitter } from "./event-emitter/event-emitter";

const TEST_EVENT = "test";
const eventEmitterTest = new EventEmitter();

eventEmitterTest.once(TEST_EVENT, (p1: string) => console.log("fun1 ", p1));
eventEmitterTest.on(TEST_EVENT, (_: string, p2: string) => console.log("fun2 ", p2));

eventEmitterTest.emmit(TEST_EVENT, "hello world", "good bye");
console.log();
eventEmitterTest.emmit(TEST_EVENT, "hello world 2", "good bye 2");
console.log(eventEmitterTest.eventNames());
