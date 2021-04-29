import { Context, inject } from "@loopback/context";
import { Server } from "@loopback/core";
import { repository } from "@loopback/repository";
import { Channel, connect, Connection } from "amqplib";
import { Category } from "../models";
import { CategoryRepository } from "../repositories";

export class RabbitmqServer extends Context implements Server {
    private _listening: boolean;
    private channel: Channel;
    conn: Connection;

    constructor(@repository(CategoryRepository) private categoryRepository: CategoryRepository){
        super();
    }

    async start(): Promise<void> {
        this.conn = await connect({
            hostname: 'rabbitmq',
            username: 'admin',
            password:  'admin'
        });
        this._listening = true;
        this.boot();
        return undefined;
    }

    async boot() {
        this.channel = await this.conn.createChannel();
        const queue = await this.channel.assertQueue('micro-catalog/sync-videos');
        const exchange = await this.channel.assertExchange('amq.topic', 'topic');
        
        
        await this.channel.bindQueue(queue.queue, exchange.exchange, 'model.*.*');

        //const result = this.channel.sendToQueue('first-queue', Buffer.from('hello-world'));
        //await this.channel.publish('amq.topic', 'minha-routing-queue', Buffer.from('hello-world by routing key'));
        this.channel.consume(queue.queue, (message) => {
            if(!message){
                return;
            }
            const data = JSON.parse(message.content.toString());
            const [model, event] = message.fields.routingKey.split('.').slice(1);            
            this
                .sync({model, event, data})
                .then(() => this.channel.ack(message))
                .catch((error) => {
                    console.log(error);
                    this.channel.reject(message, false);
                }
            );
        });
        //this.debug(result);
    }

    async sync({model, event, data} : {model: string, event: string, data: Category}) {
        if(model === 'category') {
            switch (event) {
                case 'created':
                    await this.categoryRepository.create({
                        ...data,
                        created_at: new Date().toISOString()
                    });
                    break;
                case 'updated':
                    await this.categoryRepository.updateById(data.id, data);
                    break;
                case 'deleted':
                    await this.categoryRepository.deleteById(data.id);
                    break;
            }
        }
        return undefined;
    }

    async stop(): Promise<void> {
        await this.conn.close();
        this._listening = false;
        return undefined;
    }

    get listening(): boolean  {
        return this._listening;
    }
}