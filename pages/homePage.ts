import {Page, Locator, test} from '@playwright/test';


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
        test.info().annotations.push({type: 'info', description: '🌏 Navegamos a la URL: ' + url});
        await this.page.waitForLoadState('networkidle');
        if (await this.page.title() === 'Rick and Morty') {
            test.info().annotations.push({type: 'info', description: '✅ Navegación OK a: ' + url});
        }
    }

    async evaluateCharacterSpecies(): Promise<void> {
        const cardsCount = await this.characterCards.count();
        let allHumans = true;

        for (let i = 0; i < cardsCount; i++) {
            const speciesLocator = this.characterCards.nth(i).locator('span.text-sm.text-gray-300');
            const speciesText = await speciesLocator.textContent();

            if (speciesText !== 'Human') {
                allHumans = false;
                break;
            }
        }

        if (allHumans) {
            test.info().annotations.push({ type: 'error', description: '🐞Todos los personajes están marcados como Human' });
        }
    }


    async searchCharacter(name: string): Promise<string> {
        await this.searchInput.fill(name);
        await this.page.keyboard.press('Enter');
        test.info().annotations.push({type: 'info', description: '🔎 Buscamos el personaje: ' + name});
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        return this.page.url();
        //await this.page.goto(`https://v0-rick-and-morty-api-six.vercel.app/?name=${name}`)
    }

    //AÑADIMOS UNA ESPERA DE 1 SEGUNDO PARA QUE TERMINEN DE CARGARSE TODOS LOS ELEMENTOS DE LA WEB
    async filterByStatus(status: string): Promise<string> {

        await this.filterDropdown.click();
        await this.page.waitForSelector('div[role="listbox"]');
        const optionLocator = this.page.locator(`div[role="option"]:has-text("${status}")`);
        await optionLocator.click();
        await this.filterButton.click();
        test.info().annotations.push({type: 'info', description: '🔎 Filtramos por estado: ' + status});
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForTimeout(1000);
        return this.page.url();

    }

    async getCharacterCount(): Promise<number> {
        const {totalPages } = await this.getPageNumbers();
        if (totalPages == 1){
            test.info().annotations.push({type: 'info', description: '💯 Obtenemos el total de personajes: ' + await this.characterCards.count()});
            return await this.characterCards.count();
        }else{
            test.info().annotations.push({type: 'info', description: '💯 Obtenemos el total de personajes: ' + totalPages*20});
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