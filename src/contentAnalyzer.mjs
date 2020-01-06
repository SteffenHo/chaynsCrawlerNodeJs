import HTMLParser from 'node-html-parser';

export default class ContentAnalyzer{
    constructor(htmlText) {
        this.htmlText = htmlText;
        this.html = undefined
    }

    init() {
        let html = HTMLParser.parse(this.htmlText);
        //console.log(html.firstChild);
        this.html = html;
    }

    getTextByTag(tag = 'p'){
        let all = this.html.querySelectorAll('p');
        let texts = []
        //console.log(all);
        for(let i = 0, l = all.length; i < l; i++) {
            texts.push(all[i].text);
        }
        return texts;
    }
     // Getting all headlines with a h-Tag. h1 to h6
    getTagedHeadlines() {
        let tagedHeadlines = [];

        for(let i = 1; i < 6; i++){
            let headlines = this.html.querySelectorAll(`h${i}`);
            if(headlines && headlines.length > 0) {
                let headlineTexts = [];
                for(let i = 0, l = headlines.length; i < l; i++) {
                    headlineTexts.push(headlines[i].text);
                }
                tagedHeadlines.push({headline: i, appearances: headlineTexts})
            }
        }
        console.log(tagedHeadlines);

        return tagedHeadlines;
    }

}
