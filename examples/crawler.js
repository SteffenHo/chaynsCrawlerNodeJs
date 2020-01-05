const CDP =  require('chrome-remote-interface')

CDP((client) => {
    const {Page, Runtime} = client;

    Promise.all([
        Page.enable()
    ]).then(()=> {
        return Page.navigate({url: 'https://seo.chayns.net'})
    });

    Page.loadEventFired(() => {
        Runtime.evaluate({expression: 'document.body.outerHTML'}).then((result) => {
            console.log(result.result.value);
            client.close();
        });
    });
}).on('error', (err) => {
    console.error('Cannot connect to browser:', err);
});
