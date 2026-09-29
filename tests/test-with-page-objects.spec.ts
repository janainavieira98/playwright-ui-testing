import { test } from '@playwright/test'
import { PageManager } from '../page-objetcs/page-manager'
import {faker} from '@faker-js/faker'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Navigate to form layouts page', async ({ page }) => {
    const pom = new PageManager(page)
    await pom.navigateTo.formLayoutsPage()
    await pom.navigateTo.dataPickerPage()
    await pom.navigateTo.toasterPage()
    await pom.navigateTo.tooltipPage()
    await pom.navigateTo.toasterPage()
})

test('Parametrized page object methods', async({page}) =>{
    const pom = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = faker.internet.email({provider: 'test.com'})

    await pom.navigateTo.formLayoutsPage()
    await pom.formLayoutPage.submitUsingTheGridForm(randomEmail, 'teste', 'Option 2')
    await page.waitForTimeout(500)
    await page.screenshot({path: 'screenshots/formLayouts.png'})
    await pom.formLayoutPage.submitInlineForm(randomFullName, randomEmail, false)
    //await pom.navigateTo.dataPickerPage()
    //await pom.datePickerPage.selectCommonDateFromToday(5)
    //await pom.datePickerPage.selectDatePickerWithDangeFromToday(7, 20)
})