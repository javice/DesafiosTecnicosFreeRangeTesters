import { test, expect } from '@playwright/test';
import HomePage from '../pages/homePage';
import characterPage from "../pages/characterPage";

// Colores para la terminal
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color

test.describe('Desafio FRT Marzo 2025', () => {
    test('Verificar que los filtros y búsqueda funcionan correctamente', async ({ page }) => {
        const homePage = new HomePage(page);
        const baseURI = 'https://v0-rick-and-morty-api-six.vercel.app'
        const characterName = "Aqua Rick"
        const currentStatus = 'dead'
        const currentHTMLStatus = 'Desconocido'

        let searchUrl: string;

        console.log(`${CYAN} TEST: Verificar que los filtros y búsqueda funcionan correctamente.${NC}`);

        //Navegamos a la página principal
        console.log(`${GREEN} Navegando a la Home Page...${NC}`);
        await homePage.navigate(baseURI);

        // Prueba de búsqueda
        await test.step(`Buscar personaje "${characterName}"`, async () => {
            searchUrl = await homePage.searchCharacter(characterName);
            const characterCount = await homePage.getCharacterCount();

            console.log(`${CYAN} STEP 1.- Busqueda de personajes con nombre ${characterName}${NC}`);
            console.log(`${GREEN}Número de personajes con nombre ${characterName} encontrados: ${characterCount}${NC}`);
            expect(characterCount, `${RED}Error: No se encontraron personajes después de la búsqueda.${NC}`).toBeGreaterThan(0);
            expect(searchUrl, `${RED}Error: La URL de búsqueda no es correcta.${NC}`).not.toBeNull();
            //toContain(characterName);
            console.log(`${RED}${searchUrl}${NC}`);
            console.log(`${CYAN}====== FIN DEL STEP 1 - Busqueda de personajes ${characterName} ======${NC}`);
        });

        // Prueba de filtro
        await test.step(`Filtrar personajes por estado "${currentHTMLStatus}"`, async () => {
            searchUrl = await homePage.filterByStatus(currentHTMLStatus);
            const filteredCharacterCount = await homePage.getCharacterCount();

            console.log(`${CYAN} STEP 2.- Busqueda de personajes ${characterName} filtrados con estatus ${currentHTMLStatus}${NC}`);
            console.log(`${GREEN}Número de personajes con nombre ${characterName} filtrados por ${currentHTMLStatus} : ${filteredCharacterCount}${NC}`);
            expect(filteredCharacterCount, '${RED}Error: No se encontraron personajes después del filtrado.${NC}').toBeGreaterThan(0);
            console.log(`${CYAN}====== FIN DEL STEP 2 - Busqueda de personajes ${currentHTMLStatus} ======${NC}`);
        });

        // Prueba de evaluación de especies
        await test.step(`Evaluar especies de personajes`, async () => {
            console.log(`${CYAN} STEP 3.- Evaluar especies de personajes ${characterName}${NC}`);
            await homePage.evaluateCharacterSpecies();
            console.log(`${CYAN}====== FIN DEL STEP 3 - Evaluar especies de personajes ======${NC}`);
        });

        //Prueba selección de un personaje
        await test.step('Ver detalles de un personaje y navegar de vuelta a la Página de Personajes', async () => {

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
            console.log(`${RED}===== VOLVEMOS A LA PAGINA DE PERSONAJES =======${NC}`);

            test.info().annotations.push({type:'info', description: `ℹ️ DETALLES DE: ${characterDetails.name}`});
            test.info().annotations.push({type:'info', description: `📊 ESTADO: ${characterDetails.status}`});
            test.info().annotations.push({type:'info', description: `👽 RAZA: ${characterDetails.species}`});
            test.info().annotations.push({type:'info', description: `🏞️ LOCALIZACIÓN: ${characterDetails.location}`});
            test.info().annotations.push({type:'info', description: `🌎 ORÍGEN: ${characterDetails.origin}`});
            test.info().annotations.push({type:'info', description: `🧬 GÉNERO: ${characterDetails.gender}`});
            test.info().annotations.push({type:'info', description: `🌠 IMÁGEN: ${characterDetails.image}`});
            test.info().annotations.push({type:'info', description: `🎬 EPISODIOS: ${characterDetails.episodes}`});
            test.info().annotations.push({type:'info', description: `🐣 FECHA CREACIÓN: ${characterDetails.creationDate}`});
            test.info().annotations.push({type: 'info', description: '🌏 Navegamos de vuelta a la Página de Personajes: ' + searchUrl});

            if (characterDetails.species.includes('Human -')) {
                console.log(`${RED} ERROR!! Todos los personajes que NO son humanos están marcados al principio como Human${NC}`);
                test.info().annotations.push({
                    type: 'error',
                    description: '🐞 ERROR!! Todos los personajes NO humanos están marcados al principio como Human: '});

            }

            const backToCharactersPage = await characterPageInstance.navigateBack();
            console.log(`${CYAN}Volviendo a la Página de Personajes...${backToCharactersPage}${NC}`);
            if (backToCharactersPage === searchUrl) {
                console.log(`${GREEN}Volvimos a la Página de Personajes...${NC}`);
                test.info().annotations.push({
                    type: 'info',
                    description: '🌏 Navegamos de vuelta a la Página de Personajes: ' + searchUrl});
            }else{
                console.log(`${RED} ERROR!! No volvimos a la Página de Personajes${NC}`);
                test.info().annotations.push({
                    type: 'error',
                    description: '❌ ERROR!! No volvimos a la Página de Personajes: ' + searchUrl});
            }
            //expect(backToCharactersPage, `${RED} ERROR!! No volvimos a la Página de Personajes${NC}`).toMatch(searchUrl);
            //console.log(`${GREEN}Volvimos a la Página de Personajes...${NC}`);
            console.log(`${CYAN}====== FIN DEL STEP 4 - Ver detalles de un personaje y navegar de vuelta a la Home Page ======${NC}`);

        });
        console.log(`${CYAN}====================== FIN DEL TEST. =====================${NC}`);
    });
});