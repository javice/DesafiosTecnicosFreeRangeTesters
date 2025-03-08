// pages/FormPage.ts
import { Page, Locator, test } from '@playwright/test';

interface MandatoryFields {
    name: Locator;
    surname: Locator;
    email: Locator;
    phone: Locator;
    address: Locator;
    city: Locator;
    interests: Locator;
}

interface NonMandatoryFields {
    zipcode: Locator;
    country: Locator;
    job: Locator;
}

interface FieldData {
    [key: string]: string;
}

class FormPage {
    private readonly page: Page;
    private readonly url: string;
    private readonly mandatoryFields: MandatoryFields;
    private readonly nonMandatoryFields: NonMandatoryFields;
    private readonly submitButton: Locator;
    private readonly errorMessages: Locator;
    private readonly successMessage: Locator;

    // Inicializamos los atributos de la clase FormPage
    // Definimos los selectores de los campos obligatorios y no obligatorios
    constructor(page: Page) {
        this.page = page;
        this.url = 'https://v0-classic-registration-form-u8ghow.vercel.app/?utm_source=podia&utm_medium=broadcast&utm_campaign=2332486';
        this.mandatoryFields = {
            name: page.locator('#\\:R6jsq\\:-form-item'),
            surname: page.locator('#\\:Rajsq\\:-form-item'),
            email: page.locator('#\\:Rejsq\\:-form-item'),
            phone: page.locator('#\\:Rijsq\\:-form-item'),
            address: page.locator('#\\:Rmjsq\\:-form-item'),
            city: page.locator('#\\:Rqjsq\\:-form-item'),
            interests: page.locator('#\\:R1ajsq\\:-form-item'),
        };
        this.nonMandatoryFields = {
            zipcode: page.locator('#\\:Rujsq\\:-form-item'),
            country: page.locator('#\\:R12jsq\\:-form-item'),
            job: page.locator('#\\:R16jsq\\:-form-item'),
        };
        this.submitButton = page.locator('body > div > form > button');
        this.errorMessages = page.locator('[id$="-form-item-message"]');
        this.successMessage = page.locator('body > div > h2');
    }

    async navigate(): Promise<void> {
        await this.page.goto(this.url);
    }

    async reloadPage(options: { timeout?: number; waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }): Promise<void> {
        await this.page.reload(options);
    }



    // Rellenamos los campos obligarotios.
    // Si el campo phone no es un número, mostramos un mensaje de advertencia.
    // Si el campo phone no tiene al menos 9 caracteres numéricos, mostramos un mensaje de advertencia.
    // Si el campo phone no caracteres numéricos, la página web NO contempla este ERROR
    // y da por válido el campo.
    async fillMandatoryFields(data: FieldData): Promise<void> {
        const keys = Object.keys(data);
        for (const key of keys) {
            const value = data[key];
            if (key === 'phone' && !/^\d+$/.test(value)) {
                const warningMessage = '❌ Advertencia: El número de telefono debe tener AL MENOS 9 caracteres numéricos.\nℹ️ La página web NO contempla este ERROR y da por válido el campo.  ';
                console.warn(warningMessage);
                test.info().annotations.push({type: 'warning', description: warningMessage});
            }
            const fieldOk = '✅ Campo: ' + key + ' rellenado correctamente: ' + value;
            console.log(fieldOk);
            test.info().annotations.push({type: 'info', description: fieldOk});
            await this.mandatoryFields[key as keyof MandatoryFields].fill(value);
        }
    }


    // Rellenamos los campos no obligatorios
    async fillNonMandatoryFields(data: FieldData): Promise<void> {
        const keys = Object.keys(data);
        for (const key of keys) {
            const value = data[key];
            await this.nonMandatoryFields[key as keyof NonMandatoryFields].fill(value);
        }
    }

    async submitForm(): Promise<void> {
        await this.submitButton.click();
    }


    // Obtenemos los mensajes de error
    // Si hay un mensaje de error, lo mostramos por consola y lo añadimos a la información del test
    async getErrorMessages(): Promise<string[]> {
        const errorMessages = await this.errorMessages.allInnerTexts();
        for (const errorMessage of errorMessages) {
            const error = '❌ Error: ' + errorMessage;
            console.error(error);
            test.info().annotations.push({type: 'error', description: error});
        }
        return errorMessages;
    }

    // Obtenemos el mensaje de éxito
    // Si el mensaje de éxito es '¡Registro exitoso!', lo mostramos por consola
    // y lo añadimos a la información del test
    async getSuccessMessage(): Promise<string> {
        const remotePageSuccessMessage = await this.successMessage.innerText();
        if (remotePageSuccessMessage === '¡Registro exitoso!') {
            const successMessage = '🎉 Registro exitoso!';
            console.log(successMessage);
            test.info().annotations.push({type: 'info', description: successMessage});
        }else{
            const errorMessage = '❌ Error: ' + remotePageSuccessMessage;
            console.error(errorMessage);
            test.info().annotations.push({type: 'error', description: errorMessage});
        }
        return remotePageSuccessMessage;
    }
}

export default FormPage;