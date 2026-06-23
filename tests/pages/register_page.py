from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class RegisterPage:
    URL_SUFFIX = "/register"

    # Selectors
    NAME_INPUT     = (By.NAME, "reg_name")
    EMAIL_INPUT    = (By.NAME, "reg_email")
    PASS_INPUT     = (By.NAME, "reg_pass")
    CONFIRM_INPUT  = (By.NAME, "reg_confirm")
    TERMS_CB       = (By.ID, "reg_terms_cb")
    PRIVACY_CB     = (By.ID, "reg_privacy_cb")
    SUBMIT_BTN     = (By.CSS_SELECTOR, ".login-submit-btn")
    ERROR_MSG      = (By.CSS_SELECTOR, ".login-error")
    THEME_TOGGLE   = (By.CSS_SELECTOR, ".login-theme-toggle")
    ROOT           = (By.CSS_SELECTOR, ".login-root")

    def __init__(self, driver, base_url: str):
        self.driver = driver
        self.base_url = base_url
        self.wait = WebDriverWait(driver, 10)

    def open(self):
        self.driver.get(f"{self.base_url}{self.URL_SUFFIX}")
        return self

    def fill_form(self, name: str, email: str, password: str, confirm: str = None):
        self.driver.find_element(*self.NAME_INPUT).clear()
        self.driver.find_element(*self.NAME_INPUT).send_keys(name)
        self.driver.find_element(*self.EMAIL_INPUT).clear()
        self.driver.find_element(*self.EMAIL_INPUT).send_keys(email)
        self.driver.find_element(*self.PASS_INPUT).clear()
        self.driver.find_element(*self.PASS_INPUT).send_keys(password)
        self.driver.find_element(*self.CONFIRM_INPUT).clear()
        self.driver.find_element(*self.CONFIRM_INPUT).send_keys(confirm or password)
        return self

    def check_terms(self):
        self.driver.find_element(*self.TERMS_CB).click()
        return self

    def check_privacy(self):
        self.driver.find_element(*self.PRIVACY_CB).click()
        return self

    def check_all_legal(self):
        return self.check_terms().check_privacy()

    def is_submit_disabled(self) -> bool:
        btn = self.driver.find_element(*self.SUBMIT_BTN)
        classes = btn.get_attribute("class")
        disabled_attr = btn.get_attribute("disabled")
        return "disabled" in classes or disabled_attr is not None

    def submit(self):
        self.driver.find_element(*self.SUBMIT_BTN).click()
        return self

    def toggle_theme(self):
        self.driver.find_element(*self.THEME_TOGGLE).click()
        return self

    def is_dark(self) -> bool:
        root = self.driver.find_element(*self.ROOT)
        return "dark" in root.get_attribute("class")

    def has_error(self) -> bool:
        els = self.driver.find_elements(*self.ERROR_MSG)
        return len(els) > 0 and els[0].is_displayed()
