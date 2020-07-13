import mongoose, { Connection, Error }  from "mongoose";
import mongoosePaginate, { setOptions } from "./paginate";
import conf                             from "../../../conf";

import { info, debug } from "../../util/logger";


let connections: {
    [name: string]: Connection
} = {};

mongoose.Promise = global.Promise;

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);

mongoose.set("debug", (...args: any[]) => debug(
    {
        date: (new Date).toUTCString(),
        name: "MongooseQuery",
        info: args,
    },
));

const dateConnect: number = Date.now();

setOptions({
    lean: true,
    limit: 20,
});

mongoose.plugin(mongoosePaginate);

const config = conf.env.mongodb as any;

for (let name in config) {
    if (config.hasOwnProperty(name)) {
        connections[name] = mongoose.createConnection(config[name].url, config[name].options);
    }
}

export const connect = () => {
    Promise.all(Object.values(connections))
           .then((cons: Connection[]): any => {
               cons.map((con: any) => {
                   debug({
                       name: "Mongoose",
                       status: "connected",
                       connection: con.name,
                       host: con.host,
                       port: con.port,
                       db: con.$dbName,
                   });
               });
           })
           .catch((reason: Error) => {
               process.exit(1);
               info("Mongoose:err()", ((new Date).getTime() - dateConnect),
                   reason.message);
           })
           .finally(() => {
               info({message: "Mongoose:finally()"});
           });

};

export default connections;
