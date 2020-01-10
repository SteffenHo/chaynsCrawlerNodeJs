
export default  class StringHelper{

    static joinStringArray(strings){
        return  strings.join(' ');
    }

    static removeHTMLTags(string) {
        return string.replace(/<\/?[^>]+(>|$)/g, "");
    }

    static replaceUmlaut(string) {
        let value = string;
        value = value.replace(/ä/g, 'ae');
        value = value.replace(/ö/g, 'oe');
        value = value.replace(/ü/g, 'ue');
        value = value.replace(/ß/g, 'ss')
        value = value.replace(/Ä/g, 'Ae');
        value = value.replace(/Ö/g, 'Oe');
        value = value.replace(/Ü/g, 'Ue');
        return value;
    }

    static replaceTextMarker(string) {
        let result = string;
        result = result.replace(/\t/g, '');
        result = result.replace(/\n/g, '');
        result = result.replace(/\r/g, '');
        result = result.replace(/  /g, ' ');
        result = result.replace(/\b/g, '');

        return result;
    }
}
