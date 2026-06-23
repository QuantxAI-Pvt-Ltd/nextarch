from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


class LoginPage:
    URL_SUFFIX = "/login"

    # Selectors
    EMAIL_INPUT    = (By.NAME, "login_email")
    PASS_INPUT     = (By.NAME, "login_pass")
    SUBMIT_BTN     = (By.CSS_SELECTOR, ".login-submit-btn")
    REGISTER_BTN   = (By.CSS_SELECTOR, ".reg-submit-btn")
    ERROR_MSG      = (By.CSS_SELECTOR, ".login-error")
    SUCCESS_MSG    = (By.CSS_SELECTOR, ".login-success")
    THEME_TOGGLE   = (By.CSS_SELECTOR, ".login-theme-toggle")
    ROOT           = (By.CSS_SELECTOR, ".login-root")
    REMEMBER_CB    = (By.CSS_SELECTOR, ".login-checkbox")
    RESET_BTN      = (By.CSS_SELECTOR, ".login-link-btn")

    def __init__(self, driver, base_url: str):
        self.driver = driver
        self.base_url = base_url
        self.wait = WebDriverWait(driver, 10)

    def open(self):
        self.driver.get(f"{self.base_url}{self.URL_SUFFIX}")
        return self

    def enter_email(self, email: str):
        self.driver.find_element(*self.EMAIL_INPUT).clear()
        self.driver.find_element(*self.EMAIL_INPUT).send_keys(email)
        return self

    def enter_password(self, password: str):
        self.driver.find_element(*self.PASS_INPUT).clear()
        self.driver.find_element(*self.PASS_INPUT).send_keys(password)
        return self

    def submit(self):
        self.driver.find_element(*self.SUBMIT_BTN).click()
        return self

    def login(self, email: str, password: str):
        return self.enter_email(email).enter_password(password).submit()

    def toggle_theme(self):
        self.driver.find_element(*self.THEME_TOGGLE).click()
        return self

    def is_dark(self) -> bool:
        root = self.driver.find_element(*self.ROOT)
        return "dark" in root.get_attribute("class")

    def get_error_text(self) -> str:
        return self.driver.find_element(*self.ERROR_MSG).text

    def has_error(self) -> bool:
        els = self.driver.find_elements(*self.ERROR_MSG)
        return len(els) > 0 and els[0].is_displayed()

    def has_success(self) -> bool:
        els = self.driver.find_elements(*self.SUCCESS_MSG)
        return len(els) > 0 and els[0].is_displayed()

    def wait_for_redirect(self, path: str):
        self.wait.until(EC.url_contains(path))
        return self
