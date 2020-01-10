import natural from 'natural'
import CONSTS from "./consts";
import rakeJs from 'rake-js'

export default  class ContentAnalyzer {
    static tf_idfAnalysisGetKeywords(string, amount) {
        let tfidf = new natural.TfIdf();
        let count = 0;
        let result = [];

        tfidf.addDocument(string);

        tfidf.listTerms(0).forEach((item) => {
            if(count < amount){
                result.push({keyword: item.term, index: item.tfidf});
                count++;
            }
        });

        return result;

    }

    /**
     * Use a RANK analyse for keyword extraction
     * @param string
     * @param amount int if missing return all
     */
    static rakeGetKeywords(string, amount) {
        const opts = {stopwords: CONSTS.getRAKEStopWords()};
        console.log(rakeJs);
        const keywords = rakeJs.default(string, { language: 'german',  delimiters: ['.', ',', '-', ' '] });
        console.log('rake', keywords);
        if(!amount){
            return keywords;
        }
        const returnKeywords = [];
        for(let i = 0, l = keywords.length; i <l && i < amount; i++){
            returnKeywords.push(keywords[i])
        }
        return returnKeywords;
    }
}
