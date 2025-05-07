const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const fs = require('fs');

(async function automateIntervue() {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().addArguments('--window-size=1920,1080'))
    .build();
  
  try {
    // Step 1: Open Intervue.io
    await driver.get('https://www.intervue.io');
    await driver.wait(until.titleContains('Intervue'), 5000);
    console.log('✅ Opened https://www.intervue.io');
    await driver.sleep(5000); // Delay
    
    // Step 2: Click Main Login Button
    const loginBtn = await driver.wait(
      until.elementLocated(By.css('a.loginBtn[href="/access-account"]')),
      10000
    );
    await loginBtn.click();
    console.log('✅ Clicked main Login button');
    await driver.sleep(5000); // Delay

 // STEP 3: BULLETPROOF BUTTON CLICK
try {
    console.log('🚀 EXECUTING NUCLEAR CLICK PROTOCOL...');

    // 1. Wait for dynamic content to load
    await driver.wait(async () => {
        return await driver.executeScript(`
            return document.querySelector('a.AccessAccount-ColoredButton[href="/login"]') !== null;
        `);
    }, 20000); // 20 second timeout

    // 2. Nuclear click approach
    await driver.executeScript(`
        // Find the exact button
        const btn = document.querySelector('a.AccessAccount-ColoredButton[href="/login"]');
        
        // Visual confirmation (red border + glow)
        btn.style.border = '3px solid red';
        btn.style.boxShadow = '0 0 15px red';
        
        // Simulate human-like interaction
        btn.scrollIntoView({behavior: 'smooth', block: 'center'});
        
        // Multiple click methods
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        });
        
        btn.dispatchEvent(clickEvent);
        setTimeout(() => btn.click(), 100);
    `);

    // 3. Verify navigation
    await driver.wait(until.urlContains('login'), 10000);
    console.log('✔ Login page reached successfully!');

} catch (error) {
    console.error('❌ ULTIMATE FALLBACK ACTIVATED');
    await driver.takeScreenshot().then((data) => {
        fs.writeFileSync('nuclear_fallback.png', data, 'base64');
    });
    await driver.get('https://www.intervue.io/login');
}
    // Step 4: Enter credentials
    await driver.wait(until.elementLocated(By.name('email')), 5000).sendKeys('neha@intervue.io');
    await driver.findElement(By.name('password')).sendKeys('Neha@567intervue', Key.RETURN);
    console.log('✅ Submitted credentials');
    await driver.sleep(5000); // Delay
    
    // Step 5: Wait for dashboard
    await driver.wait(until.urlContains('dashboard'), 10000);
    console.log('✔ Login successful!');
    await driver.sleep(5000); // Delay

    // Step 6: Navigate directly to Internal Interviews Platform
    console.log('Navigating directly to Internal Interviews Platform...');
    await driver.get('https://www.intervue.io/profile/interviews');
    console.log('✅ Navigated to Internal Interviews Platform');
    await driver.sleep(5000); // Delay

    // Search for "hello"
    try {
      await driver.sleep(3000);
      
      const searchSelectors = [
        'input[type="search"]',
        'input[placeholder*="Search"]',
        'input[aria-label*="search"]',
        '[role="search"] input',
        'input.search-input',
        'input[name="search"]'
      ];
      
      let searchBar = null;
      for (const selector of searchSelectors) {
        try {
          const elements = await driver.findElements(By.css(selector));
          if (elements.length > 0) {
            searchBar = elements[0];
            console.log(`✅ Found search bar using selector: ${selector}`);
            break;
          }
        } catch (e) {
          // Try next
        }
      }
      
      if (searchBar) {
        await searchBar.clear();
        await searchBar.sendKeys('hello', Key.RETURN);
        console.log('✅ Searched for "hello"');
        await driver.sleep(5000); // Delay
      } else {
        console.log('⚠️ Could not find search bar');
      }
    } catch (err) {
      console.log('⚠️ Error with search functionality:', err.message);
    }

    // Logout process
    try {
      console.log('Starting logout process...');
      
      const userAvatarSelector = 'div[class*="userAvatar"], div[class*="Avatar_AvatarDiv"]';
      await driver.wait(until.elementLocated(By.css(userAvatarSelector)), 10000);
      const userAvatar = await driver.findElement(By.css(userAvatarSelector));
      await userAvatar.click();
      console.log('✅ Clicked user avatar to open dropdown');
      await driver.sleep(5000); // Delay
      
      const logoutLinkSelector = 'a[href="/logout"], a[class*="Dropdown__DropdownItemLink"][href="/logout"]';
      await driver.wait(until.elementLocated(By.css(logoutLinkSelector)), 5000);
      const logoutLink = await driver.findElement(By.css(logoutLinkSelector));
      await logoutLink.click();
      console.log('✅ Clicked logout link');
      await driver.sleep(6000); // Delay before closing
    } catch (err) {
      console.error('❌ Error during logout process:', err.message);
      await driver.takeScreenshot().then((data) => {
        const timestamp = new Date().toISOString().replace(/:/g, '-');
        const screenshotPath = `logout_error_${timestamp}.png`;
        fs.writeFileSync(screenshotPath, data, 'base64');
        console.log(`📸 Error screenshot saved: ${screenshotPath}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    await driver.takeScreenshot().then((data) => {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const screenshotPath = `error_screenshot_${timestamp}.png`;
      fs.writeFileSync(screenshotPath, data, 'base64');
      console.log(`📸 Error screenshot saved: ${screenshotPath}`);
    });

    try {
      console.log('Current URL:', await driver.getCurrentUrl());
    } catch (e) {
      console.log('Could not get current URL');
    }
  } finally {
    await driver.quit();
  }
})();
