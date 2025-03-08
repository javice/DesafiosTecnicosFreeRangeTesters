import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';

const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color
const requestChainDead = 'https://rickandmortyapi.com/api/character/?status=dead';
const requestChainAlive = 'https://rickandmortyapi.com/api/character/?status=alive';
const requestChainUnknown = 'https://rickandmortyapi.com/api/character/?status=unknown';
const requestChainRickAlive = 'https://rickandmortyapi.com/api/character/?name=Rick+Sanchez&status=alive';
const requestChainFalse = 'https://rickandmortyapi.com/api/character/?name=Adjudicator+Rick&status=alive';

async function validateCharacterFields(character: any) {
    expect(character).toHaveProperty('name');
    expect(character).toHaveProperty('status');
    expect(character).toHaveProperty('species');
    expect(character).toHaveProperty('location');
    expect(character).toHaveProperty('image');
    expect(character).toHaveProperty('type');
    expect(character).toHaveProperty('gender');
    expect(character).toHaveProperty('origin.name');
    expect(character).toHaveProperty('origin.url');
    expect(character).toHaveProperty('location.name');
    expect(character).toHaveProperty('location.url');
    expect(character).toHaveProperty('url');
}

async function fetchAndValidateAPI(request: any, url: string, status: string) {
    console.log(`${CYAN}======= PETICIÓN A LA API FILTRANDO POR STATUS "${status.toUpperCase()}" =======${NC}`);
    const response = await request.get(url);
    expect(response.status(), `${RED}Error: La solicitud GET no fue exitosa.${NC}`).toBe(200);
    if (response.status() === 200) {
        console.log(`${GREEN}La solicitud GET fue exitosa.${NC}`);
    }
    console.log(`${CYAN}===========================================================${NC}`);
    return response.json();
}

async function compareAPIWithFrontend(page: any, url: string, apiCount: number, status: string) {
    const homePage = new HomePage(page);
    await homePage.navigate(url);
    const htmlCharacterCount = await homePage.getCharacterCount();
    const { currentPage, totalPages } = await homePage.getPageNumbers();
    console.log(`Página actual: ${currentPage}`);
    console.log(`Total de páginas: ${totalPages}`);
    expect(currentPage).toBeGreaterThan(0);
    expect(totalPages).toBeGreaterThan(0);

    console.log(`${CYAN}API VS FRONTEND. STATUS = ${status.toUpperCase()} ${NC}`);
    console.log(`${GREEN}- Caracteres Totales API: ${apiCount}${NC}`);

    if (apiCount > 20) {
        console.log(`${GREEN}- Caracteres Totales FRONTEND: ${totalPages * 20}${NC}`);
        if (apiCount != totalPages * 20) {
            console.log(`${RED}- EL NUMERO DE CARACTERES STATUS = ${status.toUpperCase()} NO COINCIDEN!! --${NC}`);
        } else {
            console.log(`${CYAN}- EL NUMERO DE CARACTERES CON STATUS = ${status.toUpperCase()} COINCIDEN!! --${NC}`);
        }
    } else {
        console.log(`${GREEN}- Caracteres Totales FRONTEND: ${htmlCharacterCount}${NC}`);
        if (apiCount != htmlCharacterCount) {
            console.log(`${RED}- EL NUMERO DE CARACTERES CON STATUS = ${status.toUpperCase()} NO COINCIDEN!! --${NC}`);
        } else {
            console.log(`${CYAN}- EL NUMERO DE CARACTERES CON STATUS = ${status.toUpperCase()} COINCIDEN!! --${NC}`);
        }
    }
}

test('Verificar que la data del FrontEnd coincide con el BackEnd para status DEAD', async ({ request, page }) => {
    console.log(`${CYAN} TEST: Verificar que la data del FrontEnd coincide con el BackEnd para status DEAD.${NC}`);

    const deadCharacters = await fetchAndValidateAPI(request, requestChainDead, 'dead');
    expect(deadCharacters.info.count, `${RED}Error: No se encontraron personajes en la respuesta.${NC}`).toBeGreaterThan(0);
    if (deadCharacters.info.count > 0) {
        console.log(`${GREEN}La solicitud GET tiene ${deadCharacters.info.count} personajes.${NC}`);
    }
    await validateCharacterFields(deadCharacters.results[0]);
    await compareAPIWithFrontend(page, 'https://v0-rick-and-morty-api-six.vercel.app/?status=dead', deadCharacters.info.count, 'dead');
    console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);
});

test('Verificar que la data del FrontEnd coincide con el BackEnd para status UNKNOWN', async ({ request, page }) => {
    console.log(`${CYAN} TEST: Verificar que la data del FrontEnd coincide con el BackEnd para status UNKNOWN.${NC}`);
    const unknownCharacters = await fetchAndValidateAPI(request, requestChainUnknown, 'unknown');
    expect(unknownCharacters.info.count, `${RED}Error: No se encontraron personajes en la respuesta.${NC}`).toBeGreaterThan(0);
    if (unknownCharacters.info.count > 0) {
        console.log(`${GREEN}La solicitud GET tiene ${unknownCharacters.info.count} personajes.${NC}`);
    }
    await validateCharacterFields(unknownCharacters.results[0]);
    await compareAPIWithFrontend(page, 'https://v0-rick-and-morty-api-six.vercel.app/?status=unknown', unknownCharacters.info.count, 'unknown');
    console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);
});

test('Verificar que la data del FrontEnd coincide con el BackEnd para status ALIVE', async ({ request, page }) => {
    console.log(`${CYAN} TEST: Verificar que la data del FrontEnd coincide con el BackEnd para status ALIVE.${NC}`);

    const aliveCharacters = await fetchAndValidateAPI(request, requestChainAlive, 'alive');
    expect(aliveCharacters.info.count, `${RED}Error: No se encontraron personajes en la respuesta.${NC}`).toBeGreaterThan(0);
    if (aliveCharacters.info.count > 0) {
        console.log(`${GREEN}La solicitud GET tiene ${aliveCharacters.info.count} personajes.${NC}`);
    }
    await validateCharacterFields(aliveCharacters.results[0]);
    await compareAPIWithFrontend(page, 'https://v0-rick-and-morty-api-six.vercel.app/?status=alive', aliveCharacters.info.count, 'alive');
    console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);
});

test('Verificar que la data del FrontEnd coincide con el BackEnd para status Rick Sánchez y ALIVE', async ({ request, page }) => {
    console.log(`${CYAN} TEST: Verificar que la data del FrontEnd coincide con el BackEnd para status Rick Sánchez y ALIVE.${NC}`);

    const aliveRickCharacters = await fetchAndValidateAPI(request, requestChainRickAlive, 'alive');
    expect(aliveRickCharacters.info.count, `${RED}Error: No se encontraron personajes en la respuesta.${NC}`).toBeGreaterThan(0);
    if (aliveRickCharacters.info.count > 0) {
        console.log(`${GREEN}La solicitud GET tiene ${aliveRickCharacters.info.count} personajes.${NC}`);
    }
    await validateCharacterFields(aliveRickCharacters.results[0]);
    await compareAPIWithFrontend(page, 'https://v0-rick-and-morty-api-six.vercel.app/?name=Rick+Sanchez&status=alive', aliveRickCharacters.info.count, 'alive');
    console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);
});

test('Verificar que la data del FrontEnd coincide con el BackEnd para consulta falsa', async ({ request }) => {
    console.log(`${CYAN} TEST: Verificar que la data del FrontEnd coincide con el BackEnd para consulta falsa.${NC}`);

    const falseResponse = await request.get(requestChainFalse);
    expect(falseResponse.status(), `${RED}Error: La solicitud GET no encontró personajes.${NC}`).toBe(404);
    if (falseResponse.status() === 404) {
        console.log(`${GREEN}La solicitud GET FALSA fue exitosa.${NC}`);
    }
    console.log(`${CYAN}===========================================================${NC}`);
    const falseCharacters = await falseResponse.json();
    expect(falseCharacters.error.length, `${RED}Error: Se encontraron personajes en la respuesta.${NC}`).toBeGreaterThan(0);
    if (falseCharacters.error.length === 1) {
        console.log(`${GREEN}La solicitud GET no tiene personajes.${NC}`);
        console.log(`${GREEN}${falseCharacters.error}.${NC}`);
    }
    console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);
});

