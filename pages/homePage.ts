import {Page, Locator} from '@playwright/test';


class HomePage {
    page: Page;
    searchInput: Locator;
    filterDropdown: Locator;
    filterButton: Locator;
    characterCards: Locator;
    firstCharacterCard: Locator ;
    pageCounter: Locator;


    constructor(page: Page) {
        this.page = page;
        this.searchInput = page.getByRole('textbox', { name: 'Buscar personajes...' });
        this.filterDropdown = page.getByRole('combobox');
        this.filterButton = page.getByRole('button', { name: 'Filtrar' });
        this.characterCards = page.locator('.grid .rounded-lg');
        this.firstCharacterCard = page.locator('body > main > div > div:nth-child(3) > div.grid.grid-cols-1.sm\\:grid-cols-2.md\\:grid-cols-3.lg\\:grid-cols-4.gap-6 > a:nth-child(1)');
        this.pageCounter = page.locator('body > main > div > div:nth-child(3) > div.flex.justify-center.items-center.gap-2.mt-8.mb-4 > span')

    }

    async navigate(url:string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle');
    }

    async searchCharacter(name: string): Promise<void> {
        await this.searchInput.fill(name);
        //await this.filterButton.click();
        await this.page.keyboard.press('Enter');
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        //await this.page.goto(`https://v0-rick-and-morty-api-six.vercel.app/?name=${name}`)
    }

    //AÑADIMOS UNA ESPERA DE 1 SEGUNDO PARA QUE TERMINEN DE CARGARSE TODOS LOS ELEMENTOS DE LA WEB
    async filterByStatus(status: string): Promise<void> {

        await this.filterDropdown.click();
        await this.page.waitForSelector('div[role="listbox"]');
        const optionLocator = this.page.locator(`div[role="option"]:has-text("${status}")`);
        await optionLocator.click();
        await this.filterButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);

    }

    async getCharacterCount(): Promise<number> {
        const {totalPages } = await this.getPageNumbers();
        if (totalPages == 1){
            return await this.characterCards.count();
        }else{
            return totalPages*20;
        }

    }

    async getFirstCharacter()    {
        return this.characterCards.first();

    }
    async getFirstCharacterLink(){
        return this.firstCharacterCard.getAttribute("href");
    }

    async getPageNumbers(): Promise<{ currentPage: number, totalPages: number }> {
        const text = await this.pageCounter.textContent();
        const match = text?.match(/Página (\d+) de (\d+)/);
        if (match) {
            const currentPage = parseInt(match[1], 10);
            const totalPages = parseInt(match[2], 10);
            return { currentPage, totalPages };
        } else {
            throw new Error('No se pudo extraer los números de página');
        }
    }


}

export default HomePage;