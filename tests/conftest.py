import pytest
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from webdriver_manager.chrome import ChromeDriverManager
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), ".env.test"))

BASE_URL   = os.getenv("BASE_URL", "http://localhost:3000")
TEST_EMAIL = os.getenv("TEST_EMAIL", "")
TEST_PASS  = os.getenv("TEST_PASS", "")


def pytest_configure(config):
    config.addinivalue_line("markers", "auth: authentication tests")
    config.addinivalue_line("markers", "footer: footer/theme tests")
    config.addinivalue_line("markers", "calculator: calculator module tests")
    config.addinivalue_line("markers", "subscribe: subscription/paywall tests")
    config.addinivalue_line("markers", "legal: legal page tests")
    config.addinivalue_line("markers", "responsive: responsive/a11y tests")


@pytest.fixture(scope="session")
def driver():
    """Session-scoped Chrome WebDriver."""
    opts = webdriver.ChromeOptions()
    opts.add_argument("--window-size=1440,900")
    opts.add_argument("--disable-blink-features=AutomationControlled")
    opts.add_experimental_option("excludeSwitches", ["enable-automation"])
    # Uncomment for headless CI:
    # opts.add_argument("--headless=new")
    # opts.add_argument("--no-sandbox")
    # opts.add_argument("--disable-dev-shm-usage")
    drv = webdriver.Chrome(
        service=Service(ChromeDriverManager().install()),
        options=opts,
    )
    drv.implicitly_wait(8)
    yield drv
    drv.quit()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 10)


@pytest.fixture
def base_url():
    return BASE_URL


@pytest.fixture
def credentials():
    return {"email": TEST_EMAIL, "password": TEST_PASS}


@pytest.fixture
def fresh_driver(driver):
    """Clear cookies/localStorage before a test."""
    driver.delete_all_cookies()
    driver.execute_script("window.localStorage.clear(); window.sessionStorage.clear();")
    return driver


@pytest.fixture
def logged_in(driver, base_url, credentials, wait):
    """Log in before a test; sign out after."""
    driver.delete_all_cookies()
    driver.execute_script("window.localStorage.clear();")
    driver.get(f"{base_url}/login")
    driver.find_element(By.NAME, "login_email").send_keys(credentials["email"])
    driver.find_element(By.NAME, "login_pass").send_keys(credentials["password"])
    driver.find_element(By.CSS_SELECTOR, ".login-submit-btn").click()
    wait.until(EC.url_contains("/calculator"))
    yield driver
    driver.get(f"{base_url}/api/signout")
    driver.delete_all_cookies()
