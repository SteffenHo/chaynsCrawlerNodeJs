const CDP = require('chrome-remote-interface');

CDP(async(client) => {
    const {Network, Page, Runtime} = client;
    try {
        await Network.enable();
        await Page.enable();
        //await Network.setCacheDisabled({cacheDisabled: true});
        await Page.navigate({url: 'https://seo.chayns.net'});
        await Page.loadEventFired();
        let t = setTimeout(async() => {
            const result = await Runtime.evaluate({
                expression: 'document.documentElement.outerHTML'

            });
            const html = result.result.value;
            console.log(html);

            client.close();
        }, 3000)

    } catch (err) {
        console.error(err);
    } finally {

    }
}).on('error', (err) => {
    console.error(err);
});
