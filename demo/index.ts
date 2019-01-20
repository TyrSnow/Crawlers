import Crawler from './Crawler';

let crawler = new Crawler();

crawler.start('http://www.baidu.com').then((store) => {
    store.flush('./demo/output.json');
});
