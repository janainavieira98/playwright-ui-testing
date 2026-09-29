import {expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})


test.describe('Form Layouts page', () => {

    test.beforeEach(async ({ page }) => {
        await page.getByText('Forms').click()
        await page.getByText('Form Layouts').click()
    })

    test('Input Fields', async ({ page }) => {
        const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using the Grid"}).getByRole('textbox', {name: "Email"})
        await usingTheGridEmailInput.fill('test@test.com')
        await usingTheGridEmailInput.clear()
        await usingTheGridEmailInput.pressSequentially('test@test.com')

        //extract the value
        const inputValue = await usingTheGridEmailInput.inputValue()

        //assertions
        await expect(usingTheGridEmailInput).toHaveValue('test21@test.com')
        await expect(usingTheGridEmailInput).toHaveValue(/test.com/)
    })  

    test('radio button', async ({page}) => {
        const usingTheGridForm = page.locator('nb-card', {hasText: "Using the Grid"})


        await usingTheGridForm.getByLabel('Option 1').check({force: true})
        await usingTheGridForm.getByRole('radio', {name: "Option 2"}).check({force: true})

        const radioStatus = await usingTheGridForm.getByRole('radio', {name: "Option 2"}).isChecked()
        expect(radioStatus).toBeTruthy()

        await expect(usingTheGridForm.getByRole('radio', {name: 'Option 2'})).toBeChecked()
        await expect(usingTheGridForm.getByRole('radio', {name: "Option 1"})).not.toBeChecked()
    })

    test('checked', async ({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()

        await page.getByRole('checkbox', {name: 'Hide on click'}).check({force: true})
        
        const allBoxes = page.getByRole('checkbox')
        for(const box of await allBoxes.all()){
            await box.check({force: true})
            await expect(box).toBeChecked()
        }
    
    })

    test('Dropdowns', async ({page}) => {

        await page.getByText('Modal & Overlays').click()
        await page.getByText('Toastr').click()
        await page.locator('.form-group', {hasText: 'Toast type:'}).getByRole('combobox').selectOption('info')
        await expect(page.getByRole('combobox')).toHaveValue('info')

        await page.locator('.form-group', {hasText: 'Position:'}).locator('nb-select').click()

        await page.locator('nb-option', {hasText: "bottom-end"}).click()
        await expect(page.locator('.form-group', {hasText: 'Position:'}).locator('nb-select')).toHaveText('bottom-end')

        //looping through the list
        const positionDropDownField = page.locator('.form-group', {hasText: 'Position:'}).locator('nb-select')
        await positionDropDownField.click()
        const allListValues = page.locator('nb-option').allTextContents()

        for(const listValues of await allListValues) {
            await page.locator('nb-option', {hasText: listValues}).click()
            await expect(positionDropDownField).toHaveText(listValues)
            await positionDropDownField.click()
        }
    })

    test('tooltip', async ({page}) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Tooltip').click()

        await page.locator('button', {hasText: 'Top'}).hover()

        //Command for stop screen and debbug the element tooltip CTRL + \
        await expect(page.getByRole('tooltip')).toHaveText('This is a tooltip')
    })

    test('Dialog box', async ({page}) => {

        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        page.on('dialog', dialog => {
            dialog.accept()
        })
        await page.locator('tr', {hasText: 'mdo@gmail.com'}).locator('.nb-trash').click()
        await expect(page.locator('tr', {hasText: 'mdo@gmail.com'})).not.toBeVisible()
    })

    test('Web table', async ({page}) => {

        await page.getByText('Tables & Data').click()
        await page.getByText('Smart Table').click()

        //1 how to select row by any visible text
        const tableRowByEmail = page.getByRole('row', {name: 'snow@gmail.com'})
        await tableRowByEmail.locator('.nb-edit').click()

        await tableRowByEmail.getByPlaceholder('Age').fill('35')

        await tableRowByEmail.locator('.nb-checkmark').click()
        await expect(tableRowByEmail.locator('td').last()).toHaveText('35')

        //2 get row by a specific column value
        const  tableRowById = page.getByRole('row').filter({has: page.getByRole('cell').nth(1).getByText('10')})
        await tableRowById.locator('.nb-edit').click()
        await page.locator('tbody').getByPlaceholder('E-mail').fill('test@test.com')
        await page.locator('tbody').locator('.nb-checkmark').click()
        await expect(tableRowById.locator('td').nth(5)).toHaveText('test@test.com')


        //how to filter for a value in a table
        const ages = ["20", "10", "200", "35"]

        for(let age of ages){
            await page.getByRole('textbox', {name: 'age'}).fill(age)

            if(age == "200"){
                await expect(page.locator('tbody')).toContainText('No data found')
            } 
            else {

                await expect(page.locator('tbody tr').first().locator('td').last()).toHaveText(age)
                const allTableRows = await page.locator('tbody tr').all()

                for(let row of allTableRows){
                    await expect(row.locator('td').last()).toHaveText(age)
                }
            }
        }
    })

    test('Data picker', async({page}) => {
        await page.getByText('Datepicker').click()
        await page.getByPlaceholder('Form Picker').click()

        await page.locator('.cell-content').getByText('8', {exact: true}).click()

        await expect(page.getByPlaceholder('Form Picker')).toHaveValue('Sep 8, 2026')
    })

      test('Data picker Get Date', async({page}) => {
        await page.getByText('Datepicker').click()
        await page.getByPlaceholder('Form Picker').click()


        const date = new Date();
        date.setDate(date.getDate() + 10);
        const expectedDay = date.getDate().toString()
        const expectedMonth = date.toLocaleString('En-US', {month: 'short'})
        const expectedMonthLong = date.toLocaleString('En-US', {month: 'long'})
        const expectedYear = date.getFullYear()
        const expectedDate = `${expectedMonth} ${expectedDay}, ${expectedYear}`

        let currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`

        while(!currentMonthAndYear?.includes(expectedMonthAndYear)){
            await page.locator('.next-month').click()
            currentMonthAndYear = await page.locator('nb-calendar-view-mode').textContent()
        }
        
        await page.locator('.day-cell:not(.bounding-month)').getByText(expectedDay, {exact: true}).click()
        await expect(page.getByPlaceholder('Form Picker')).toHaveValue(expectedDate)
    })
    
    test('sliders', async ({ page }) => {
        await page.getByText('IoT Dashboard').click()
        //const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
        //await tempGauge.evaluate( element => {
        //    element.setAttribute('cx', '232.630')
        //    element.setAttribute('cy', '232.630')
        //})
        //await tempGauge.click()

        //2 mouse movement
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded()

        const box = await tempBox.boundingBox()
        const x = box?.x + box?.y / 2
        const y = box?.y + box?.height / 2
        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x+100, y)
        await page.mouse.move(x+100, y+100)
        await page.mouse.up()
        await expect(tempBox).toContainText('29')

    })

    test('iFrames', async({ page }) => {
        await page.getByText('Modal & Overlays').click()
        await page.getByText('Dialog').click()

        const frameLocator = page.frameLocator('[data-cy="esc-close-iframe"]')

        await frameLocator.getByRole('button', {name: 'Open Dialog with esc close'}).click()
    })

    test('Drag & Drop', async({page}) => {
        await page.getByText('Extra Components').click()
        await page.getByText('Drag & Drop').click()

        //1
        await page.getByText('Clean my room').dragTo(page.locator('#drop-list'))

        //2
        await page.getByText('Get groceries').hover()
        await page.mouse.down()
        await page.locator('#drop-list').hover()
        await page.mouse.up()
    })
})