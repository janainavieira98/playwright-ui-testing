import { Page } from "@playwright/test";
import { NavigationPage } from "./navigation-page";
import { DatePickerPage } from "./date-picker-page";
import { FormLayoutsPage } from "./form-layouts-page";

export class PageManager {

    readonly navigateTo: NavigationPage
    readonly formLayoutPage: FormLayoutsPage
    readonly datePickerPage: DatePickerPage

    constructor(page: Page){
        this.navigateTo = new NavigationPage(page)
        this.formLayoutPage = new FormLayoutsPage(page)
        this.datePickerPage = new DatePickerPage(page)
    }
}