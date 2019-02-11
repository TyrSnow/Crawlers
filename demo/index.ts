import Crawler from './Crawler';

let crawler = new Crawler();

crawler.start('https://www.kuaidaili.com/free/').then((store) => {
    store.flush('./demo/output.json');
});
