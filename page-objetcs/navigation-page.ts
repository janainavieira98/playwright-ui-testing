import { Locator, Page } from "@playwright/test";
import { HelperBase } from "./helper-base";
import { step } from "../helpers/test-step-decorator"; 

export class NavigationPage extends HelperBase{

  
    readonly datePickerMenu: Locator
    readonly formLayoutsMenu: Locator
    readonly tooltipMenu: Locator
    readonly toastrMenu: Locator

    constructor(page: Page){
        super(page)
        this.datePickerMenu = page.getByText('Datepicker')
        this.formLayoutsMenu = page.getByText('Form Layouts')
        this.tooltipMenu = page.getByText('Tooltip')
        this.toastrMenu = page.getByText('Toastr')
    }

    @step
    async formLayoutsPage() {
        await this.selectGroupMenuItem('Forms')
        await this.formLayoutsMenu.click()
        const toastrMessage = await this.getToastrMessage()
        console.log(toastrMessage);
        
    }
    @step
    async dataPickerPage(){
        await this.selectGroupMenuItem('Forms')
        await this.page.waitForTimeout(1000)
        await this.datePickerMenu.click()
    }
    @step
    async toasterPage(){
        await this.page.getByText('Modal & Overlays').click()
        await this.toastrMenu.click()
    }
    @step
    async tooltipPage(){
        await this.page.getByText('Modal & Overlays').click()
        await this.tooltipMenu.click()
    }

    private async selectGroupMenuItem(groupMenuTitle: string){
        const groupMenuItem = this.page.getByTitle(groupMenuTitle)
        const expandedState = await groupMenuItem.getAttribute('aria-expanded')
        if(expandedState == "false"){
            await groupMenuItem.click()
        }
    }
}