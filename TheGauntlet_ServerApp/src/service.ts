"use strict";
import express = require("express");
import bodyParser = require("body-parser");
import cors = require("cors");
import fs = require('fs');

import moment = require('moment');

import mongoose = require('mongoose');
import {Config} from "./shared";
import {StateRoutes, HealthCheckRoutes} from "./routes";
import {Winston} from "winston";
import {StateSeedModule} from "./modules";

global.Promise = require('bluebird');
mongoose.Promise = global.Promise;

export class GauntletService {
    private pkg = require("../package.json");
    private winston: Winston = require('winston');

    private app: any; // express server
    private envReady: boolean = false;

    //region services

    //todo wire up global shared service

    //endregion

    //region sub-module definitions

    private stateSeedModule: StateSeedModule;

    //endregion

    constructor(private testMode: boolean = false, private hasDb = true) {
        this.winston.info("IN SERVICE CONSTRUCTOR")
        if (hasDb) {
            let connString: string = `mongodb://${Config.dbSettings.connectionString}/${Config.dbSettings.database}`;
            this.winston.info("connString", connString);
            if (!!process.env.USES_REPLICA)
                connString += "/?replicaSet=" + Config.dbSettings.replicaSet;

            //connect to mongodb
            mongoose.connect(connString).then(() => {
                this.winston.info('Mongo Connected!');
            }).catch((error) => {
                this.winston.error("OUR ERROR! ", connString);
                throw error;
            });
        }
    }

    //main start function
    public start() {
        this.initEnv().then(() => {
            if (this.envReady) {
                this.initWinston();

                //start internal services before starting sub-modules
                this.initServices().then(() => {
                    this.startSubModules();

                    //start the express server(s)
                    this.initExpress();

                    //all done
                    this.winston.info(this.pkg.name + " startup sequence completed", {
                        version: this.pkg.version
                    });
                }, err => {
                    this.winston.error("Error in main ()", {
                        err: err
                    });
                });
            } else {
                this.winston.error("Env did not ready up");
            }
        });
    }

    //setup the log folder and any other environment needs
    private initEnv(): Promise<void> {
        return new Promise<void>((resolve) => {
            let logDir: string = Config.serviceSettings.logsDir;
            fs.stat(logDir, (err) => {
                if (!!err)
                    fs.mkdir(logDir, () => {
                        this.envReady = true;
                        resolve();
                    });
                else {
                    this.envReady = true;
                    resolve();
                }
            });
        });
    }

    private initWinston() {
        //winston is configured as a private variable to the main app.ts
        //it can then be spread to child modules or routeModules. This way only one winston object needs to be setup
        this.winston.remove(this.winston.transports.Console);
        this.winston.add(this.winston.transports.Console, {
            colorize: true,
            prettyPrint: true,
            timestamp: true
        });

        this.winston.add(this.winston.transports.File, {
            name: 'error',
            level: 'error',
            filename: 'logs/error.log',
            maxsize: 10485760,
            maxFiles: '10',
            timestamp: true
        });
        this.winston.add(this.winston.transports.File, {
            name: 'warn',
            level: 'warn',
            filename: 'logs/warn.log',
            maxsize: 10485760,
            maxFiles: '10',
            timestamp: true
        });
        this.winston.add(this.winston.transports.File, {
            name: 'info',
            level: 'info',
            filename: 'logs/info.log',
            maxsize: 10485760,
            maxFiles: '10',
            timestamp: true
        });
        this.winston.add(this.winston.transports.File, {
            name: 'verbose',
            level: 'verbose',
            filename: 'logs/verbose.log',
            maxsize: 10485760,
            maxFiles: '10',
            timestamp: true
        });

        this.winston.info('Winston has been init hello');
    }

    private initExpress() {
        //create express
        this.app = express();
        this.initCORS();
        //make express use the bodyParser for json middleware
        this.app.use(bodyParser.json({}));

        //health check
        let healthCheckRoutes: HealthCheckRoutes = new HealthCheckRoutes(this.winston);
        this.app.use("/", healthCheckRoutes.getRoutes());

        //todo add a security layer here, such as JWT

        //add in any routes you might want
        this.initAppRoutes();

        //and start!
        this.app.listen(Config.apiSettings.port);
        this.winston.info("Express started @ " + moment().format("HH:mm:ss Do MMMM YYYY") + " (http://localhost:" + Config.apiSettings.port + "/)");
    }

    private initCORS() {
        //todo: optional, configure better cors
        // let corsOptions = {
        //     origin: (origin, callback) => {
        //         let originIsWhitelisted: boolean = Config.apiSettings.corsWhitelist.indexOf(origin) !== -1;
        //         callback(null, originIsWhitelisted);
        //     }
        // };

        this.app.use(cors());
    }

    private initAppRoutes() {
        this.app.get('/', (req, res) => {
            res.send("A blank request? Good one...");
        });

        let stateRoutes: StateRoutes = new StateRoutes(this.winston);
        this.app.use(Config.apiSettings.baseApiUri, stateRoutes.getRoutes());

        this.winston.info("Express running on http://localhost:" + Config.apiSettings.port);
    }

    private initServices(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            //if you have any SDKs that need to be init, do so here
            resolve(true);
        });
    }

    private startSubModules() {
        this.stateSeedModule = new StateSeedModule(this.winston);
    }
}