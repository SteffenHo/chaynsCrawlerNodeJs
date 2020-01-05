//const chromeLauncher = require('chrome-launcher');
//const CDP = require('chrome-remote-interface');
import chromeLauncher from 'chrome-launcher'
import CDP from 'chrome-remote-interface'

export default class Browser {
    constructor() {
        this.Page = undefined;
        this.Runtrime = undefined;
        this.chrome = undefined;
        this.protocol = undefined;
    }

    getPage() {
        if(this.Page) {
            return this.Page;
        }
        throw 'Page is not initialized';
    }

    getRuntime() {
        if(this.Runtrime){
            return this.Runtrime;
        }
        throw  'Runtime is not initialized'
    }
    launchChrome(){
        console.log('launchChrome..');
        return chromeLauncher.launch({
            chromeFlags: [
                '--disable-web-security', '--headless', '--disable-gpu'// Query within iframes
            ],
            logLevel: 'info'
        }).catch(function(e) {
            console.log('Error launching chrome: ' + e);
        });
    }

    async initChrome () {
        console.log('initChrome..');
        const chrome = await this.launchChrome();
        const protocol = await CDP({port: chrome.port});

        const {Page, Runtime, Network} = protocol;
        const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36 - Steffen Holtkamp ChaynsCrawler';
        await Promise.all([Page.enable(), Runtime.enable(), Network.setUserAgentOverride({userAgent})]);

        return {chrome: chrome, protocol: protocol, Page: Page, Runtime: Runtime}
    }

    async start() {
        try {
            let {chrome, protocol, Page, Runtime} = await this.initChrome();
            this.Page = Page;
            this.Runtrime = Runtime;
            this.chrome = chrome;
            this.protocol = protocol;

            return true;
        } catch (e) {
            return  false;
        }
    }

    stop() {
        this.protocol.close();
        this.chrome.kill();
    }
}

//module.exports = Browser
