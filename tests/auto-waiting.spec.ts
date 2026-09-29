import {expect, test} from '@playwright/test'

test.beforeEach(async ({ page }) => {
    
   
    await page.goto('/')
    await page.getByText('Modal & Overlays').click()
    await page.getByText('Dialog').click()
    
})

test('Open dialog', async ({ page }) => {
    
    const dialogWithDelayForm = page.locator('nb-card', {hasText: 'Open Dialog With Delay'})
    await dialogWithDelayForm.getByRole('button', {name: 'Open with delay 3 seconds'}).click()
    await page.waitForResponse('**/delay/**')
    const dialogContainer = page.locator('nb-dialog-container')

    const dialogHeaderText = await dialogContainer.locator('nb-card-header').allTextContents()
    expect(dialogHeaderText).toContain('Friendly reminder')
})

test('Timeouts', async ({ page }) => {

    const dialogWithDelayForm = page.locator('nb-card', {hasText: 'Open with delay 3 seconds'})
    await dialogWithDelayForm.getByRole('button', {name: '3 seconds'}).click()
    const dialogContainer = page.locator('nb-dialog-container')

    await dialogContainer.getByRole('button', {name: 'OK'}).click({timeout: 4000})

})