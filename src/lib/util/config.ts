import path    from "path";
import Dotenv from "dotenv";
import Debug  from "debug";

Debug.names.push(new RegExp("", "gm"));
Dotenv.config({path: path.join(process.cwd(), ".env")});

import configs from "../../conf";

const parser = (configs: any) => {
    for (let name in configs) {
        if (configs.hasOwnProperty(name)) {
            let config = configs[name];
            merge(configs, config, name);
        }
    }
};

const set = (key: string): string => {
    let env = process.env;
    if (env[key] !== undefined) {
        return env[key];
    }
    return null;
};

const merge = (configs: any, config: any, name?: string, joinedKey?: string) => {
    if (!joinedKey) {
        joinedKey = name;
    } else {
        joinedKey = `${joinedKey}_${name}`;
    }
    if (!(typeof config === "object")) {
        let data = set(joinedKey);
        if (data) {
            configs[name] = data;
        }
    } else if (typeof config === "object") {
        for (let sub_name in config) {
            if (config.hasOwnProperty(sub_name)) {
                let config = configs[name];
                merge(configs[name], config[sub_name], sub_name, joinedKey);
            }
        }
    }
};

export default parser(configs);
