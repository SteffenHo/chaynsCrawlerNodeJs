import Browser from './browser';
import requestXML from './request';
import Crawler from "./crawler";
import ContentAnalyzer from "./contentAnalyzer";
import StringHelper from "./stringHelper";

export default  class Manager {
    constructor(url, maxSites) {
        this.siteUrl = url;
        this.browser = undefined;
        this.maxSites = maxSites
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

        return urls //['https://min-danmark.dk/EinfachDaenemark'] // ['https://seo.chayns.net/TestTapp'] //urls;

    }

    async run () {
        try {
            let allTexts = [];
            let allKeywords = [];
            await this.init();
            const urls = await this.loadSitemap();

            const crawler = new Crawler(this.browser.getPage(), this.browser.getRuntime());
            for(let i = 0, l = urls.length; i < l && i < this.maxSites; i++){
                console.log(urls[i])
                let result = await crawler.start(urls[i]);
                if(result){
                    if(result.keywords){
                        allKeywords = allKeywords.concat(result.keywords);
                    }
                    if (result.rawText) {
                        allTexts.push(result.rawText)
                    }
                }
            }
            console.log('allText', allTexts);
            console.log('allKeywords', allKeywords);
            console.log('site Keywords', ContentAnalyzer.rakeGetKeywords(StringHelper.joinStringArray(allTexts)));
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
