import { EventEmitter } from "events"
import { SocketWithData } from "../game.gateway";

export class GameEmitter extends EventEmitter {
    connections: SocketWithData[];
    id: number;
    name: string;
    constructor(id: number, name: string) {
        super();
        this.id = id;
        this.name = name;
    }
    
    on(eventName: string, ...args: any) {
        this.connections.forEach((s) => {
            s.emit(eventName, args);
        });
    }
}