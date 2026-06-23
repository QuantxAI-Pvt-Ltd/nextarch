from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class SubscribePage:
    URL_SUFFIX = "/subscribe"

    ROOT         = (By.CSS_SELECTOR, ".sub-root")
    THEME_BTN    = (By.CSS_SELECTOR, ".sub-theme-btn")
    TRIAL_BADGE  = (By.CSS_SELECTOR, ".sub-trial-badge")
    PLAN_CARDS   = (By.CSS_SELECTOR, ".sub-card")
    FEATURED     = (By.CSS_SELECTOR, ".sub-card--featured")
    CARD_BADGE   = (By.CSS_SELECTOR, ".sub-card-badge")
    CTA_BTNS     = (By.CSS_SELECTOR, ".sub-cta-btn")
    ERROR_MSG    = (By.CSS_SELECTOR, ".sub-error")
    BACK_LINK    = (By.CSS_SELECTOR, ".sub-back-link")

    def __init__(self, driver, base_url: str):
        self.driver = driver
        self.base_url = base_url
        self.wait = WebDriverWait(driver, 10)

    def open(self):
        self.driver.get(f"{self.base_url}{self.URL_SUFFIX}")
        return self

    def is_dark(self) -> bool:
        els = self.driver.find_elements(*self.ROOT)
        if not els:
            return False
        return "dark" in els[0].get_attribute("class")

    def toggle_theme(self):
        self.driver.find_element(*self.THEME_BTN).click()
        return self

    def get_plan_card_count(self) -> int:
        return len(self.driver.find_elements(*self.PLAN_CARDS))

    def get_badge_text(self) -> str:
        return self.driver.find_element(*self.CARD_BADGE).text.strip()

    def is_trial_badge_visible(self) -> bool:
        els = self.driver.find_elements(*self.TRIAL_BADGE)
        return len(els) > 0 and els[0].is_displayed()

    def click_cta(self, index: int = 0):
        btns = self.driver.find_elements(*self.CTA_BTNS)
        btns[index].click()
        return self

    def is_razorpay_open(self) -> bool:
        """Detect if Razorpay checkout iframe is present in DOM."""
        iframes = self.driver.find_elements(
            By.CSS_SELECTOR, "iframe[src*='checkout.razorpay.com']"
        )
        return len(iframes) > 0

    def close_razorpay(self):
        from selenium.webdriver.common.keys import Keys
        from selenium.webdriver.common.action_chains import ActionChains
        ActionChains(self.driver).send_keys(Keys.ESCAPE).perform()
        return self
