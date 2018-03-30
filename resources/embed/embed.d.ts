/// <reference path="./../typings/tsd.d.ts" />

// declare function require(path: string): string;
declare var require: {
    <T>(path: string): T;
    (paths: string[], callback: (...modules: any[]) => void): void;
    ensure: (paths: string[], callback: (require: <T>(path: string) => T) => void) => void;
};

interface Window {
    downloadFile?: any;
    jsonUrl?:any;
}
interface Element {
    url?:string;
    title?:any;
}

interface PymInstance {
    Child(): void;
    onMessage(): void;
}

interface PymStatic {
    (options?: any): PymInstance;
}

declare var pym:PymStatic;