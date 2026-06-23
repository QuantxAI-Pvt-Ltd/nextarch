from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# Maps mode param → sidebar link text
CALCULATOR_MODES = {
    "volume-heat-gain":      "Volume of Air (Heat Gain)",
    "window-calculations":   "Window Calculations",
    "volume-forces":         "Volume of Air (Qw + Qt Forces)",
    "q-from-ach":            "Q from ACH",
    "by-element":            "By Element",
    "solar-heat-gain":       "Equivalent Solar Heat Gain",
}


class CalculatorPage:
    URL_SUFFIX = "/calculator"

    # Header selectors
    HEADER         = (By.CSS_SELECTOR, "header")
    BRAND_NAME     = (By.CSS_SELECTOR, "header span")
    THEME_BTN      = (By.CSS_SELECTOR, "header button[aria-label='Toggle theme']")
    MENU_BTN       = (By.CSS_SELECTOR, "header button.p-2.-ml-2")  # mobile hamburger

    # Sidebar
    SIDEBAR        = (By.CSS_SELECTOR, "aside")
    COLLAPSE_BTN   = (By.CSS_SELECTOR, "aside button.absolute.-right-3")
    SIDEBAR_LINKS  = (By.CSS_SELECTOR, "aside nav a")

    # Content
    MAIN_CONTENT   = (By.CSS_SELECTOR, "main")
    PAYWALL_POPUP  = (By.CSS_SELECTOR, "[class*='paywall'], [class*='Paywall']")

    # Theme shell (ThemedShell wrapper div)
    THEMED_SHELL   = (By.CSS_SELECTOR, "main")

    def __init__(self, driver, base_url: str):
        self.driver = driver
        self.base_url = base_url
        self.wait = WebDriverWait(driver, 10)

    def open(self, mode: str = None):
        url = f"{self.base_url}{self.URL_SUFFIX}"
        if mode:
            url += f"?mode={mode}"
        self.driver.get(url)
        return self

    def get_current_mode(self) -> str:
        from urllib.parse import urlparse, parse_qs
        params = parse_qs(urlparse(self.driver.current_url).query)
        return params.get("mode", ["window-calculations"])[0]

    def click_sidebar_mode(self, mode: str):
        link = self.driver.find_element(By.CSS_SELECTOR, f"aside nav a[href*='mode={mode}']")
        link.click()
        self.wait.until(EC.url_contains(f"mode={mode}"))
        return self

    def get_active_sidebar_bg(self) -> str:
        """Return the background-color CSS of the active sidebar link."""
        active = self.driver.find_element(By.CSS_SELECTOR, "aside nav a[style*='#1A73E8']")
        return active.value_of_css_property("background-color")

    def toggle_theme(self):
        self.driver.find_element(*self.THEME_BTN).click()
        return self

    def select_light_mode(self):
        """Open theme dropdown and click Light Mode."""
        self.toggle_theme()
        self.wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//button[contains(., 'Light Mode')]")
        ))
        self.driver.find_element(By.XPATH, "//button[contains(., 'Light Mode')]").click()
        return self

    def select_dark_mode(self):
        """Open theme dropdown and click Dark Mode."""
        self.toggle_theme()
        self.wait.until(EC.visibility_of_element_located(
            (By.XPATH, "//button[contains(., 'Dark Mode')]")
        ))
        self.driver.find_element(By.XPATH, "//button[contains(., 'Dark Mode')]").click()
        return self

    def toggle_sidebar_collapse(self):
        self.driver.find_element(*self.COLLAPSE_BTN).click()
        return self

    def is_sidebar_collapsed(self) -> bool:
        sidebar = self.driver.find_element(*self.SIDEBAR)
        # w-20 = 80px
        return sidebar.size["width"] <= 90

    def is_paywall_visible(self) -> bool:
        els = self.driver.find_elements(*self.PAYWALL_POPUP)
        return len(els) > 0 and els[0].is_displayed()

    def wait_for_content(self):
        self.wait.until(EC.presence_of_element_located(self.MAIN_CONTENT))
        return self
