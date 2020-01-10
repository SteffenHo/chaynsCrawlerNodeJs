import natural from 'natural'

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
}
