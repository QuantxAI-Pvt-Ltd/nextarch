"""
Suite 1 — Authentication Tests
TC-AUTH-01 through TC-AUTH-06
"""
import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from pages.login_page import LoginPage
from pages.register_page import RegisterPage


pytestmark = pytest.mark.auth


class TestLogin:
    """TC-AUTH-01 & TC-AUTH-02: Login flow."""

    def test_valid_login_redirects_to_calculator(self, fresh_driver, base_url, credentials):
        """TC-AUTH-01: Valid credentials → redirect to /calculator."""
        page = LoginPage(fresh_driver, base_url).open()
        page.login(credentials["email"], credentials["password"])
        page.wait_for_redirect("/calculator")
        assert "/calculator" in fresh_driver.current_url

    def test_invalid_login_shows_error(self, fresh_driver, base_url):
        """TC-AUTH-02: Wrong password → error shown, stays on /login."""
        page = LoginPage(fresh_driver, base_url).open()
        page.login("nobody@nowhere.com", "wrongpassword")
        # Small explicit wait since form submission may take a moment
        WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-error"))
        )
        assert page.has_error(), "Expected .login-error to be visible"
        assert "/login" in fresh_driver.current_url, "Should stay on /login after bad creds"

    def test_error_message_is_not_empty(self, fresh_driver, base_url):
        """Error div should contain a human-readable message."""
        page = LoginPage(fresh_driver, base_url).open()
        page.login("bad@bad.com", "badpass")
        WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-error"))
        )
        text = page.get_error_text()
        assert len(text.strip()) > 0, "Error message should not be empty"


class TestRegister:
    """TC-AUTH-03 & TC-AUTH-04: Register page interactions."""

    def test_submit_disabled_with_no_checkboxes(self, fresh_driver, base_url):
        """TC-AUTH-03a: Submit is disabled before any checkbox is checked."""
        page = RegisterPage(fresh_driver, base_url).open()
        page.fill_form("Test User", "test@example.com", "Password1!")
        assert page.is_submit_disabled(), "Button should be disabled before checking legal boxes"

    def test_submit_disabled_with_only_terms_checked(self, fresh_driver, base_url):
        """TC-AUTH-03b: Submit stays disabled with only Terms checked."""
        page = RegisterPage(fresh_driver, base_url).open()
        page.fill_form("Test User", "test@example.com", "Password1!")
        page.check_terms()
        assert page.is_submit_disabled(), "Button should still be disabled without Privacy"

    def test_submit_enabled_with_both_checkboxes(self, fresh_driver, base_url):
        """TC-AUTH-03c: Submit becomes enabled once both checkboxes are checked."""
        page = RegisterPage(fresh_driver, base_url).open()
        page.fill_form("Test User", "test@example.com", "Password1!")
        page.check_all_legal()
        assert not page.is_submit_disabled(), "Button should be enabled after both boxes are checked"

    def test_register_with_existing_email_shows_error(self, fresh_driver, base_url, credentials):
        """TC-AUTH-04: Registering with an already-used email shows an error."""
        page = RegisterPage(fresh_driver, base_url).open()
        page.fill_form("Dupe User", credentials["email"], credentials["password"])
        page.check_all_legal()
        page.submit()
        WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-error"))
        )
        assert page.has_error(), "Expected duplicate-email error"


class TestAuthGuard:
    """TC-AUTH-05: Unauthenticated access to protected routes."""

    def test_calculator_redirects_to_login_when_unauthenticated(
        self, fresh_driver, base_url
    ):
        """TC-AUTH-05: /calculator → /login when no session."""
        fresh_driver.delete_all_cookies()
        fresh_driver.execute_script("window.localStorage.clear();")
        fresh_driver.get(f"{base_url}/calculator")
        WebDriverWait(fresh_driver, 10).until(EC.url_contains("/login"))
        assert "/login" in fresh_driver.current_url

    def test_subscribe_redirects_to_login_when_unauthenticated(
        self, fresh_driver, base_url
    ):
        """TC-AUTH-05b: /subscribe → /login when no session."""
        fresh_driver.delete_all_cookies()
        fresh_driver.execute_script("window.localStorage.clear();")
        fresh_driver.get(f"{base_url}/subscribe")
        WebDriverWait(fresh_driver, 10).until(EC.url_contains("/login"))
        assert "/login" in fresh_driver.current_url


class TestThemePersistence:
    """TC-AUTH-06: Dark/light state persists via localStorage."""

    def test_dark_mode_persists_after_reload(self, fresh_driver, base_url):
        """TC-AUTH-06: Toggle → dark; refresh → still dark."""
        page = LoginPage(fresh_driver, base_url).open()
        assert not page.is_dark(), "Should start in light mode"
        page.toggle_theme()
        assert page.is_dark(), "Should switch to dark after toggle"
        fresh_driver.refresh()
        # Re-instantiate to re-find elements
        page2 = LoginPage(fresh_driver, base_url)
        WebDriverWait(fresh_driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-root"))
        )
        assert page2.is_dark(), "Dark mode should persist after page reload via localStorage"

    def test_theme_resets_to_light_when_toggled_back(self, fresh_driver, base_url):
        """Toggle twice → back to light."""
        page = LoginPage(fresh_driver, base_url).open()
        page.toggle_theme()   # → dark
        page.toggle_theme()   # → light
        assert not page.is_dark(), "Should return to light after toggling twice"
