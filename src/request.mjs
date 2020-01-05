import fetch from 'node-fetch';
import convert from 'xml-js';

export default async function requestXML(url, method = 'GET', data = null, headers = null) {
    const customHeaders = {
        Accept: 'application/xml',
    };

    let toSend = null;
    if (data) {
        customHeaders['Content-Type'] = 'application/json';
        toSend = JSON.stringify(data);
    }

    const response = await fetch(url, {
        method,
        headers: Object.assign(customHeaders, headers),
        body: toSend,
    });

    let responseBody = null;
    if (response.headers
        && response.headers.get('Content-Type')
        && response.headers.get('Content-Type').indexOf('text/xml') !== -1
        && response.status !== 204) {
        let t =  await response.text();
        let json = convert.xml2js(t,{compact: true})
        responseBody = json;
    } else {
        responseBody = await response.text();
    }

    return {
        data: responseBody,
        status: response.status,
    };
}
