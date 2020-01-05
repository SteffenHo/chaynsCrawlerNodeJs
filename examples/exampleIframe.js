const chromeLauncher = require('chrome-launcher');
const CDP = require('chrome-remote-interface');


let launchChrome = () => {
    console.log('launchChrome..');
    return chromeLauncher.launch({
        chromeFlags: [
            '--disable-web-security', '--headless', '--disable-gpu'// Query within iframes
        ],
        logLevel: 'info'
    }).catch(function(e) {
        console.log('Error launching chrome: ' + e);
    });
}

let initChrome = async () => {
    console.log('initChrome..');
    const chrome = await launchChrome();
    const protocol = await CDP({port: chrome.port});

    const {Page, Runtime, Network} = protocol;
    const userAgent = 'Mozilla/5.0 (X11; Linux x86_64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.39 Safari/537.36';
    await Promise.all([Page.enable(), Runtime.enable(), Network.setUserAgentOverride({userAgent})]);

    return {chrome: chrome, protocol: protocol, Page: Page, Runtime: Runtime}
}

let getIframeUrl = async (siteUrl) => {

    let {chrome, protocol, Page, Runtime} = await initChrome();

    try {

        await Page.navigate({url: siteUrl});
        await Page.loadEventFired();

        const result = await Runtime.evaluate({
            expression: `document.querySelector('.cw-iframe').src`

        });
       // console.log(result);
        const url = result.result.value;
        console.log(url);

        if(url) {
           await getIframeContent(url, Page, Runtime);
        }
        console.log('..Finished');
    } catch (err) {
        console.log(err);
    }

    protocol.close();
    chrome.kill();
}

let getIframeContent = async (iframeUrl, Page, Runtime) => {
    await Page.navigate({url: iframeUrl});
    await Page.loadEventFired();


    const result = await Runtime.evaluate({
        expression: `document.querySelector('#pagemaker-tapp-user').outerHTML`

    });
    // console.log(result);
    const html = result.result.value;
    console.log(html);
}

getIframeUrl('https://seo.chayns.net/')
