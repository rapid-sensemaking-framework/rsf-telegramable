/// <reference types="node" />
import { EventEmitter } from 'events';
import { ContactableProxyConfig } from 'rsf-types';
declare const init: (telegramConfig: ContactableProxyConfig) => Promise<void>;
declare const shutdown: () => Promise<void>;
declare class Telegramable extends EventEmitter {
    id: string;
    name: string;
    constructor(id: string, name: string);
    speak(message: string): Promise<void>;
    listen(callback: (message: string) => void): void;
    stopListening(): void;
}
export { init, shutdown, Telegramable };
