import { Page, Locator } from '@playwright/test';

class CharacterPage {
    page: Page;
    btnBack: Locator
    characterName: Locator;
    characterStatus: Locator;
    characterSpecies: Locator;
    characterGender: Locator;
    characterEpisodes: Locator;
    characterCreationDate: Locator;
    characterLocation: Locator;
    characterOrigin: Locator;
    characterImage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnBack = page.getByRole('button', { name: 'Volver' })
        this.characterName = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > h1');
        this.characterStatus = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.flex.items-center.mb-6 > div');
        this.characterSpecies = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.flex.items-center.mb-6 > span');
        this.characterGender = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.grid.md\\:grid-cols-2.gap-6 > div:nth-child(2) > ul > li:nth-child(1) > span:nth-child(2)');
        this.characterEpisodes = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.grid.md\\:grid-cols-2.gap-6 > div:nth-child(2) > ul > li:nth-child(2) > span:nth-child(2)')
        this.characterCreationDate = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.grid.md\\:grid-cols-2.gap-6 > div:nth-child(2) > ul > li:nth-child(3) > span:nth-child(2)')
        this.characterLocation = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.grid.md\\:grid-cols-2.gap-6 > div.space-y-4 > div:nth-child(1) > p');
        this.characterOrigin = page.locator('body > main > div > div > div > div.p-6.md\\:w-2\\/3 > div.grid.md\\:grid-cols-2.gap-6 > div.space-y-4 > div:nth-child(2) > p')
        this.characterImage = page.locator('body > main > div > div > div > div.md\\:w-1\\/3.relative.h-96.md\\:h-auto > img');
    }

    async navigateCharacter(url: string): Promise<void> {
        await this.page.goto(url);
        await this.page.waitForLoadState('networkidle')
    }

    async navigateBack(): Promise<void> {
        const homeUrl = await this.btnBack.getAttribute("href")
        await this.btnBack.click();
    }


    async getCharacterDetails(): Promise<{
        name: string;
        status: string;
        species: string;
        location: string;
        origin: string;
        gender:string;
        episodes: string;
        creationDate: string;
        image: string;
    }> {
        return {
            name: await this.characterName.innerText(),
            status: await this.characterStatus.innerText(),
            species: await this.characterSpecies.innerText(),
            location: await this.characterLocation.innerText(),
            origin: await this.characterOrigin.innerText(),
            gender: await this.characterGender.innerText(),
            episodes: await this.characterEpisodes.innerText(),
            creationDate: await this.characterCreationDate.innerText(),
            image: await this.characterImage.getAttribute('src') || '',
        };
    }
}

export default CharacterPage;