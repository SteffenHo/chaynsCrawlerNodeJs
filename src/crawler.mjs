import ContentAnalyzer from "./contentAnalyzer";

export default class Crawler {
    constructor(page, runtime) {
        this.Page = page;
        this.Runtime = runtime;
    }

    async start(url) {

        let result = {
            title: undefined,
            iframeContent: undefined,
            tappId: undefined,
        };

        let webData = await this.getWebData(url);

        if (webData.iframeUrl) {
            result.iframeContent = await this.getIframeContent(webData.iframeUrl)
            let t = new ContentAnalyzer(result.iframeContent)
            t.init();
            t.getTagedHeadlines();
        }
        if (webData.title) {
            result.title = webData.title;
        }

        if (webData.tappId) {
            result.tappId = webData.tappId;
        }


        return result;
    }

    async getWebData(url) {
        await this.Page.navigate({url: url});
        await this.Page.loadEventFired();
        let result = {
            iframeUrl: undefined,
            title: undefined,
            tappId: undefined,
        };

        const iframeResult = await this.Runtime.evaluate({
            expression: `document.querySelector('.cw-iframe').src`

        });
        const iframeUrl = iframeResult.result.value;
        if (iframeUrl) {
            result.iframeUrl = iframeUrl;
        }

        const frameNameResult = await this.Runtime.evaluate({
            expression: `document.querySelector('.cw-iframe').id`

        });
        const frameName = frameNameResult.result.value;
        if (frameName) {
            result.tappId = frameName.substr(frameName.lastIndexOf('_') + 1);
        }

        const titleResult = await this.Runtime.evaluate({
            expression: `document.title`
        });
        const title = titleResult.result.value;
        if (title) {
            result.title = title;
        }

        return result;
    }

    async getIframeContent(iframeUrl) {
        await this.Page.navigate({url: iframeUrl});
        await this.Page.loadEventFired();


        const result = await this.Runtime.evaluate({
            expression: `document.querySelector('#pagemaker-tapp-user').outerHTML`

        });
        const html = result.result.value;
        return html;
    }
}
