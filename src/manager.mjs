import Browser from './browser';
import requestXML from './request';
import Crawler from "./crawler";

export default  class Manager {
    constructor(url) {
        this.siteUrl = url;
        this.browser = undefined;
    }


    async init() {
        const browser = new Browser();
        console.log('init Manager');
        if(await browser.start()) {
            this.browser = browser;
        }

    }

    async loadSitemap() {
        let urls = [];
        const sitemapUrl = this.siteUrl + '/sitemap.xml';
        const result = await requestXML(sitemapUrl);

        if (result && result.data && result.status === 200 && result.data.urlset && result.data.urlset.url){
            let data = result.data.urlset.url
            for(let i = 0, l = data.length; i < l; i++){
                urls.push(data[i].loc._text)
            }
        }

        return urls;

    }

    async run () {
        try {
            await this.init();
            const urls = await this.loadSitemap();

            const crawler = new Crawler(this.browser.getPage(), this.browser.getRuntime());
            for(let i = 0, l = urls.length; i < l; i++){
                let t = await crawler.start(urls[i]);
                console.log(t);
            }
        }
        catch(ex){
            console.log(ex)
        }
        finally
        {
            this.browser.stop();
        }



    }

}

//module.exports = Manager
