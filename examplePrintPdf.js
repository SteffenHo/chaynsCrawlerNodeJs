const CDP = require('chrome-remote-interface');
const fs = require('fs');

CDP(async (client) => {
    const {Page} = client;
    try {
        await Page.enable();
        await Page.navigate({url: 'https://seo.chayns.net'});
        await Page.loadEventFired();
        const {data} = await Page.printToPDF({
            landscape: true,
            printBackground: true,
            marginTop: 0,
            marginBottom: 0,
            marginLeft: 0,
            marginRight: 0
        });
        fs.writeFileSync('page.pdf', Buffer.from(data, 'base64'));
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}).on('error', (err) => {
    console.error(err);
});
