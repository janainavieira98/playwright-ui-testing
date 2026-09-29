import { Page } from "@playwright/test";

export class HelperBase {
    protected readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    protected async getToastrMessage(){
        //This method validates toasts and gets its message
        return "I'm cool toaster!"
    }
}