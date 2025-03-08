// tests/form.spec.ts

import { test, expect, Page } from '@playwright/test';
import FormPage from '../pages/formPage';

// Colores para la terminal
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const NC = '\x1b[0m'; // No Color

test.describe('Desafio FRT Febrero 2025', () => {
    let formPage: FormPage;

    test.beforeEach(async ({ page }: { page: Page }) => {
        formPage = new FormPage(page);
        await formPage.navigate();
    });



    test('NO debería dejar mandar el formulario con campos obligatorios vacíos', async () => {
        console.log(`${CYAN}TEST: NO debería dejar mandar el formulario con campos obligatorios vacíos.${NC}`);

        await formPage.submitForm();
        const errorMessage = await formPage.getErrorMessages();
        expect(errorMessage[0]).toContain('El nombre debe tener al menos 2 caracteres');
        expect(errorMessage[1]).toContain('El apellido debe tener al menos 2 caracteres.');
        expect(errorMessage[2]).toContain('Ingrese un email válido');
        expect(errorMessage[3]).toContain('Ingrese un número de teléfono válido');
        expect(errorMessage[4]).toContain('La dirección debe tener al menos 5 caracteres.');
        expect(errorMessage[5]).toContain('Ingrese una ciudad válida.');
        expect(errorMessage[6]).toContain('Este campo es obligatorio.');
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });

    test('DEBERIA dejar enviar el formulario con los campos obligatorios llenos', async () => {
        console.log(`${CYAN}TEST: DEBERIA dejar enviar el formulario con los campos obligatorios llenos.${NC}`);

        await formPage.fillMandatoryFields({
            name: 'Juan',
            surname: 'Perez',
            email: 'juan.perez@ejemplo.com',
            phone: '1234567890',
            address: 'Paseo De Los Melancólicos 1',
            city: 'Madrid',
            interests: 'Testing',
        });
        await formPage.submitForm();
        const successMessage = await formPage.getSuccessMessage();
        expect(successMessage).toBe('¡Registro exitoso!');

        console.log(`${GREEN}${successMessage}${NC}`);
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });

    test('DEBERIA dejar enviar el formulario con todos los campos llenos', async () => {
        console.log(`${CYAN}TEST: DEBERIA dejar enviar el formulario con todos los campos llenos.${NC}`);

        await formPage.fillMandatoryFields({
            name: 'Luis',
            surname: 'Aragonés',
            email: 'elsabiodehortaleza@atleti.com',
            phone: '1234567890',
            address: 'Paseo De Los Melancólicos 1',
            city: 'Madrid',
            interests: 'Ganar, ganar, ganar y volver a ganar',
        });
        await formPage.fillNonMandatoryFields({
            zipcode: '28008',
            country: 'España',
            job: 'Leyenda',
        });
        await formPage.submitForm();
        const successMessage = await formPage.getSuccessMessage();
        expect(successMessage).toBe('¡Registro exitoso!');

        console.log(`${GREEN}${successMessage}${NC}`);
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });

    test('DEBERIA LANZAR UN ERROR SI EL EMAIL NO ES VALIDO', async () => {
        console.log(`${CYAN}TEST: DEBERIA LANZAR UN ERROR SI EL EMAIL NO ES VALIDO.${NC}`);

        await formPage.fillMandatoryFields({
            name: 'John',
            surname: 'Doe',
            email: 'fruta',
            phone: '1234567890',
            address: '123 Main St',
            city: 'New York',
            interests: 'Testing',
        });
        await formPage.submitForm();
        const errorMessage = await formPage.getErrorMessages();
        expect(errorMessage[0]).toContain('email');

        console.log(`${RED}${errorMessage[0]}${NC}`);
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });

    test('DEBERIA LANZAR UN ERROR SI EL TELEFONO NO ES VALIDO', async () => {
        console.log(`${CYAN}TEST: DEBERIA LANZAR UN ERROR SI EL TELEFONO NO ES VALIDO.${NC}`);

        await formPage.fillMandatoryFields({
            name: 'Pepe',
            surname: 'Pepito',
            email: 'pepe@pepe.com',
            phone: '1234890',
            address: '123 Main St',
            city: 'New York',
            interests: 'Testing',
        });
        await formPage.submitForm();
        const errorMessage = await formPage.getErrorMessages();
        expect(errorMessage[0]).toContain('número');

        console.log(`${RED}${errorMessage[0]}${NC}`);
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });

    test('DEBERIA LANZAR UN ERROR SI EL TELEFONO CONTIENE LETRAS', async () => {
        console.log(`${CYAN}TEST: DEBERIA LANZAR UN ERROR SI EL TELEFONO CONTIENE LETRAS.${NC}`);

        await formPage.fillMandatoryFields({
            name: 'John',
            surname: 'Doe',
            email: 'pepe@pepe.com',
            phone: '1234a90',
            address: '123 Main St',
            city: 'New York',
            interests: 'Testing',
        });

        await formPage.submitForm();
        const errorMessage = await formPage.getErrorMessages();
        expect(errorMessage[0]).toContain('número');

        console.log(`${RED}${errorMessage[0]}${NC}`);
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });

    test('DEBERIA LANZAR UN ERROR SI EL NOMBRE, APELLIDO, DIRECCIÓN Y CIUDAD NO SON VALIDOS', async () => {
        console.log(`${CYAN}TEST: DEBERIA LANZAR UN ERROR SI EL NOMBRE, APELLIDO, DIRECCIÓN Y CIUDAD NO SON VALIDOS.${NC}`);

        await formPage.fillMandatoryFields({
            name: 'J',
            surname: 'D',
            email: 'pepe@pepe.com',
            phone: '1234567890',
            address: '1',
            city: 'N',
            interests: 'Testing',
        });
        await formPage.submitForm();
        const errorMessage = await formPage.getErrorMessages();
        expect(errorMessage[0]).toContain('2 caracteres');
        expect(errorMessage[1]).toContain('2 caracteres');
        expect(errorMessage[2]).toContain('5 caracteres');
        expect(errorMessage[3]).toContain('ciudad');

        console.log(`${RED}${errorMessage[0]}${NC}`);
        console.log(`${RED}${errorMessage[1]}${NC}`);
        console.log(`${RED}${errorMessage[2]}${NC}`);
        console.log(`${RED}${errorMessage[3]}${NC}`);
        console.log(`${CYAN}===== FIN DEL TEST. =======${NC}`);
    });
});