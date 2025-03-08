import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';
import characterPage from "../pages/characterPage";

// Colores para la terminal
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color

test('Verificar que los filtros y búsqueda funcionan correctamente', async ({ page }) => {
    const homePage = new HomePage(page);
    const baseURI = 'https://v0-rick-and-morty-api-six.vercel.app'
    const characterName = 'Rick'
    const currentStatus = 'dead'
    const currentHTMLStatus = 'Desconocido'

    console.log(`${CYAN} TEST: Verificar que los filtros y búsqueda funcionan correctamente.${NC}`);

    //Navegamos a la página principal
    console.log(`${GREEN} Navegando a la Home Page...${NC}`);
    await homePage.navigate(baseURI);

    // Prueba de búsqueda
    await test.step(`Buscar personaje "${characterName}"`, async () => {
        await homePage.searchCharacter(characterName);
        const characterCount = await homePage.getCharacterCount();

        console.log(`${CYAN} STEP 1.- Busqueda de personajes con nombre ${characterName}${NC}`);
        console.log(`${GREEN}Número de personajes con nombre ${characterName} encontrados: ${characterCount}${NC}`);
        expect(characterCount, `${RED}Error: No se encontraron personajes después de la búsqueda.${NC}`).toBeGreaterThan(0);
        console.log(`${CYAN}====== FIN DEL STEP 1 - Busqueda de personajes ${characterName} ======${NC}`);
    });

    // Prueba de filtro
    await test.step(`Filtrar personajes por estado "${currentHTMLStatus}"`, async () => {
        await homePage.filterByStatus(currentHTMLStatus);
        const filteredCharacterCount = await homePage.getCharacterCount();

        console.log(`${CYAN} STEP 2.- Busqueda de personajes ${characterName} filtrados con estatus ${currentHTMLStatus}${NC}`);
        console.log(`${GREEN}Número de personajes con nombre ${characterName} filtrados por ${currentHTMLStatus} : ${filteredCharacterCount}${NC}`);
        expect(filteredCharacterCount, '${RED}Error: No se encontraron personajes después del filtrado.${NC}').toBeGreaterThan(0);
        console.log(`${CYAN}====== FIN DEL STEP 2 - Busqueda de personajes ${currentHTMLStatus} ======${NC}`);
    });

    //Prueba selección de un personaje
    await test.step('Ver detalles de un personaje y navegar de vuelta a la Home Page', async () => {

        const firstCharacter = await homePage.getFirstCharacter();
        const firstCharacterLink = await homePage.getFirstCharacterLink();

        console.log(`${CYAN} STEP 3.- Ver detalles de un personaje y navegar de vuelta a la Home Page${NC}`);
        console.log(`${RED}${firstCharacterLink}${NC}`);
        await firstCharacter.click();
        const characterPageInstance = new characterPage(page);
        await characterPageInstance.navigateCharacter(baseURI+firstCharacterLink);
        const characterDetails = await characterPageInstance.getCharacterDetails();
        expect(characterDetails.name, `${RED} ERROR!! No hay detalles del personaje${NC}`).toBeTruthy();
        console.log(`${CYAN}DETALLES DE ${characterDetails.name}${NC}`);
        console.log(`${GREEN}ESTADO:${characterDetails.status}${NC}`);
        console.log(`${GREEN}RAZA:${characterDetails.species}${NC}`);
        console.log(`${GREEN}LOCALIZACIÓN:${characterDetails.location}${NC}`);
        console.log(`${GREEN}ORIGEN:${characterDetails.origin}${NC}`);
        console.log(`${GREEN}GENERO:${characterDetails.gender}${NC}`);
        console.log(`${GREEN}IMAGEN:${characterDetails.image}${NC}`);
        console.log(`${GREEN}EPISODIOS:${characterDetails.episodes}${NC}`);
        console.log(`${GREEN}FECHA CREACIÓN:${characterDetails.creationDate}${NC}`);
        console.log(`${RED}===== VOLVEMOS A LA HOME PAGE =======${NC}`);
        await characterPageInstance.navigateBack();
        console.log(`${GREEN}Volvimos a la Home Page${NC}`);
        console.log(`${CYAN}====== FIN DEL STEP 3 - Ver detalles de un personaje y navegar de vuelta a la Home Page ======${NC}`);

    });
    console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);



});