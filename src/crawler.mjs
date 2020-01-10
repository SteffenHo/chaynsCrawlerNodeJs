import ContentExtractor from "./contentExtractor";
import ContentAnalyzer from "./contentAnalyzer";
import StringHelper from "./stringHelper";

export default class Crawler {
    constructor(page, runtime) {
        this.Page = page;
        this.Runtime = runtime;
    }

    async start(url) {

        let result = {};

        let webData = await this.getWebData(url);

        if (webData.iframeUrl) {
            result.iframeContent = await this.getIframeContent(webData.iframeUrl)
            let extractor = new ContentExtractor(result.iframeContent);
            extractor.init();
            const texts = extractor.getText();

            // keyword to analyze are needed;
            //const tf_idfAnalysisResult = ContentAnalyzer.tf_idfAnalysisGetKeywords(StringHelper.joinStringArray(texts.wrapperContent), 10)
            //console.log('TF-IDF Result', tf_idfAnalysisResult);

            //keyword with RAKE analysis
            console.log('text',StringHelper.replaceTextMarker(StringHelper.joinStringArray(texts.wrapperContent)));
            const rakeAnalysisResult = ContentAnalyzer.rakeGetKeywords(StringHelper.joinStringArray(texts.wrapperContent), 20)
            result.keywords = rakeAnalysisResult;
            result.rawText = StringHelper.joinStringArray(texts.wrapperContent)
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

    clicker() {
        let e = document.querySelectorAll('.accordion__head');
        for(let i = 0; i < e.length; i++){
            e[i].click();
        }
    }
    async getIframeContent(iframeUrl, openAccordions = true) {
        await this.Page.navigate({url: iframeUrl});
        await this.Page.loadEventFired();

        if(openAccordions) {
            //Cannot open accordion because of missing click listner. Ask pagemaker to fix it.
           /* const openAccordion = await this.Runtime.evaluate({
                expression: `${clicker}()`, //'document.body.appendChild("<div class="wrapperContent">Test</div>")'//`let e = document.querySelectorAll('.accordion__head');for(let i = 0; i < e.length; i++){e[i].click();}`
                awaitPromise: true
            });*/

        }

        const result = await this.Runtime.evaluate({
            expression: `document.querySelector('#pagemaker-tapp-user').outerHTML`

        });
        const html = result.result.value;
        //console.log(html);
        return html;
    }
}
