from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class FooterPOM:
    """Helper to inspect the global Footer component."""
    FOOTER     = (By.CSS_SELECTOR, "footer")
    PP_LINK    = (By.CSS_SELECTOR, "footer a[href='/privacy-policy']")
    TERMS_LINK = (By.CSS_SELECTOR, "footer a[href='/terms']")
    COPYRIGHT  = (By.XPATH, "//footer//span[contains(text(),'VENTWISE')]")

    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(driver, 8)

    def element(self):
        return self.driver.find_element(*self.FOOTER)

    def is_visible(self) -> bool:
        els = self.driver.find_elements(*self.FOOTER)
        return len(els) > 0 and els[0].is_displayed()

    def get_background_color(self) -> str:
        """Returns the computed background-color (e.g. 'rgb(240, 244, 248)')."""
        return self.driver.execute_script(
            "return getComputedStyle(document.querySelector('footer')).backgroundColor"
        )

    def get_position(self) -> str:
        """Returns CSS position value ('fixed', 'relative', 'static', etc.)."""
        return self.driver.execute_script(
            "return getComputedStyle(document.querySelector('footer')).position"
        )

    def click_privacy_policy(self):
        self.driver.find_element(*self.PP_LINK).click()
        return self

    def click_terms(self):
        self.driver.find_element(*self.TERMS_LINK).click()
        return self

    def has_privacy_link(self) -> bool:
        return len(self.driver.find_elements(*self.PP_LINK)) > 0

    def has_terms_link(self) -> bool:
        return len(self.driver.find_elements(*self.TERMS_LINK)) > 0

    def has_copyright(self) -> bool:
        return len(self.driver.find_elements(*self.COPYRIGHT)) > 0

    def scroll_into_view(self):
        footer = self.driver.find_element(*self.FOOTER)
        self.driver.execute_script("arguments[0].scrollIntoView(true);", footer)
        return self
