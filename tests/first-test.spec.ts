import {expect, test} from "@playwright/test"

test.beforeEach(async ({ page }) => {
    await page.goto('https://playground.bondaracademy.com/')
    await page.getByText('Forms').click()
    await page.getByText('Form Layouts').click()
})
test('This is a fisrt test', async ({page}) => {
    await page.getByText('Form Layouts').click()
})

test('This is a second test', async ({page}) => {
    await page.getByText('Datepicker').click()
})

test('Locator Syntax Rules', async ({ page }) =>{
    //find by Tag
    page.locator('input')

    //find by ID
    page.locator('#inputEmail1')

    //find by class value
    page.locator('.shape-rectangle')

    //find by any attribute 
    page.locator('[placeholder="Email"]')

    //find by full class value
    page.locator('[class="input-full-width size-medium status-basic shape-rectangle nb-transition"]')

    //find by several selectors
    page.locator('input[placeholder="Email"][nbinput]')
})

test('User visible locators', async ({page}) => {

    await page.getByRole('button', {name: 'Sign in'}).first().click()

    await page.getByRole('textbox', {name: 'Email'}).first().fill('jana@gmail.com')

    await page.getByLabel('Email').first().fill('jana@gmail.com')

    await page.getByPlaceholder('Jane Doe').first().fill('jane@gmail.com')

    await page.locator('nb-card').locator('nb-radio-group').getByText('Option 2').click()
})

test('Locating parent elements', async ({ page }) => {
    await page.locator('nb-card', {hasText: 'Using the Grid'}).getByRole('button').click()
    await page.locator('nb-card',{has: page.locator('#inputEmail1')}).getByRole('button').click()
    
    await page.locator('nb-card').filter({hasText: 'Using the Grid'}).getByRole('button').click()

    await page.locator('nb-card')
        .filter({has: page.locator('nb-checkbox')})
        .filter({hasText: 'Sign in'})
        .getByLabel('Email')
        .fill('test@test.com')

    await page.getByText('Using the Grid').locator('..').getByRole('button').click()
})

test('Reusing elements', async ({ page }) => {
  
    const elementBasicForm = page.locator('nb-card', {hasText: 'Basic form'})
    const emailInputField = elementBasicForm.getByLabel('Email address')

    await emailInputField.fill('test@test.com')
    await elementBasicForm.getByLabel('Password').fill('123')
    await elementBasicForm.getByRole('button').click()
    await expect(emailInputField).toHaveValue('test@test.com')
})

test('Extracting values', async ({ page }) => {
    //extracting test
    const basicFormSection = page.locator('nb-card', {hasText: 'Basic form'})
    const submitButtonText = await basicFormSection.getByRole('button').textContent()
    expect(submitButtonText).toEqual('Submit')

    //extract multiple text values
    const allRadioButtonValues = await page.locator('nb-radio').allTextContents()
    expect(allRadioButtonValues).toContain('Option 1')

    //extract input Field Values
    const emailField = basicFormSection.getByRole('textbox', {name: 'Email'})
    await emailField.fill('test@test.com')
    const emailFieldValue = await emailField.inputValue()
    console.log(emailFieldValue)

    //extract attribute value
    const emailPlaceholder = await emailField.getAttribute('placeholder')
    console.log(emailPlaceholder)
})