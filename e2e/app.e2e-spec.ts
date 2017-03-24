import { Ng2Bs3ModalPage } from './app.po';

describe('ng2-bs3-modal App', () => {
    let page: Ng2Bs3ModalPage;

    beforeEach(() => {
        page = new Ng2Bs3ModalPage();
    });

    it('should display message saying app works', () => {
        page.navigateTo();
        expect(page.getParagraphText()).toEqual('app works!');
    });
});
