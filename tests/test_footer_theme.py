"""
Suite 2 — Footer & Theme Sync Tests
TC-FOOTER-01 through TC-FOOTER-06
"""
import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from pages.login_page import LoginPage
from pages.register_page import RegisterPage
from pages.footer import FooterPOM


pytestmark = pytest.mark.footer

# Expected computed colors (browser returns rgb, not hex)
LIGHT_BG = "rgb(240, 244, 248)"   # #f0f4f8
DARK_BG  = "rgb(15, 23, 42)"      # #0f172a


class TestFooterPresence:
    """TC-FOOTER-01 & TC-FOOTER-05: Footer exists and is not sticky."""

    def test_footer_is_present_on_login_page(self, fresh_driver, base_url):
        """TC-FOOTER-01a: Footer element exists in DOM on /login."""
        fresh_driver.get(f"{base_url}/login")
        footer = FooterPOM(fresh_driver)
        assert footer.is_visible(), "<footer> should be visible on /login"

    def test_footer_is_not_fixed_position(self, fresh_driver, base_url):
        """TC-FOOTER-01b: Footer should NOT have position:fixed (non-sticky)."""
        fresh_driver.get(f"{base_url}/login")
        footer = FooterPOM(fresh_driver)
        pos = footer.get_position()
        assert pos != "fixed", f"Footer position should not be 'fixed', got '{pos}'"

    def test_footer_visible_after_scroll_to_bottom(self, fresh_driver, base_url):
        """TC-FOOTER-01c: Footer is in viewport after scrolling to bottom."""
        fresh_driver.get(f"{base_url}/login")
        footer = FooterPOM(fresh_driver)
        footer.scroll_into_view()
        assert footer.is_visible(), "Footer should be visible after scrolling to it"

    def test_footer_has_all_required_links(self, fresh_driver, base_url):
        """TC-FOOTER-05: Footer has Privacy Policy, Terms, and copyright."""
        fresh_driver.get(f"{base_url}/login")
        footer = FooterPOM(fresh_driver)
        assert footer.has_privacy_link(), "Footer should link to /privacy-policy"
        assert footer.has_terms_link(), "Footer should link to /terms"
        assert footer.has_copyright(), "Footer should show © 2025 VENTWISE"


class TestFooterThemeSync:
    """TC-FOOTER-02 & TC-FOOTER-03: Background color syncs with theme."""

    def test_footer_background_is_light_by_default(self, fresh_driver, base_url):
        """TC-FOOTER-02: Light theme → footer background = #f0f4f8."""
        fresh_driver.execute_script("window.localStorage.clear();")
        fresh_driver.get(f"{base_url}/login")
        footer = FooterPOM(fresh_driver)
        bg = footer.get_background_color()
        assert bg == LIGHT_BG, f"Expected light bg {LIGHT_BG!r}, got {bg!r}"

    def test_footer_background_switches_to_dark(self, fresh_driver, base_url):
        """TC-FOOTER-03: Toggle to dark → footer background = #0f172a."""
        fresh_driver.execute_script("window.localStorage.clear();")
        page = LoginPage(fresh_driver, base_url).open()
        page.toggle_theme()   # switch to dark

        # Wait for React re-render
        WebDriverWait(fresh_driver, 5).until(
            lambda d: FooterPOM(d).get_background_color() == DARK_BG
        )
        bg = FooterPOM(fresh_driver).get_background_color()
        assert bg == DARK_BG, f"Expected dark bg {DARK_BG!r}, got {bg!r}"

    def test_footer_switches_back_to_light(self, fresh_driver, base_url):
        """Toggle dark → then toggle back → footer returns to light bg."""
        fresh_driver.execute_script("window.localStorage.clear();")
        page = LoginPage(fresh_driver, base_url).open()
        page.toggle_theme()   # → dark
        page.toggle_theme()   # → light again
        WebDriverWait(fresh_driver, 5).until(
            lambda d: FooterPOM(d).get_background_color() == LIGHT_BG
        )
        bg = FooterPOM(fresh_driver).get_background_color()
        assert bg == LIGHT_BG, f"Expected light bg after double-toggle, got {bg!r}"


class TestFooterThemeCrossPage:
    """TC-FOOTER-04: Theme state carries over between page navigations."""

    def test_dark_theme_persists_from_login_to_register(self, fresh_driver, base_url):
        """TC-FOOTER-04: Toggle dark on /login → navigate to /register → still dark."""
        fresh_driver.execute_script("window.localStorage.clear();")
        page = LoginPage(fresh_driver, base_url).open()
        page.toggle_theme()   # set dark
        assert page.is_dark(), "Login page should be dark"

        # Navigate to register
        reg = RegisterPage(fresh_driver, base_url).open()
        WebDriverWait(fresh_driver, 5).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".login-root"))
        )
        assert reg.is_dark(), "Register page should inherit dark theme from localStorage"

        # Footer should also be dark
        WebDriverWait(fresh_driver, 5).until(
            lambda d: FooterPOM(d).get_background_color() == DARK_BG
        )
        assert FooterPOM(fresh_driver).get_background_color() == DARK_BG

    def test_footer_visible_on_terms_page(self, fresh_driver, base_url):
        """Footer is present on /terms."""
        fresh_driver.get(f"{base_url}/terms")
        assert FooterPOM(fresh_driver).is_visible()

    def test_footer_visible_on_privacy_policy_page(self, fresh_driver, base_url):
        """Footer is present on /privacy-policy."""
        fresh_driver.get(f"{base_url}/privacy-policy")
        assert FooterPOM(fresh_driver).is_visible()


class TestFooterNavigation:
    """TC-FOOTER-06: Footer links navigate to correct pages."""

    def test_privacy_policy_link_navigates(self, fresh_driver, base_url):
        """TC-FOOTER-06a: Click PRIVACY POLICY → /privacy-policy."""
        fresh_driver.get(f"{base_url}/login")
        FooterPOM(fresh_driver).click_privacy_policy()
        WebDriverWait(fresh_driver, 8).until(EC.url_contains("/privacy-policy"))
        assert "/privacy-policy" in fresh_driver.current_url

    def test_terms_link_navigates(self, fresh_driver, base_url):
        """TC-FOOTER-06b: Click TERMS OF CONDITIONS → /terms."""
        fresh_driver.get(f"{base_url}/login")
        FooterPOM(fresh_driver).click_terms()
        WebDriverWait(fresh_driver, 8).until(EC.url_contains("/terms"))
        assert "/terms" in fresh_driver.current_url
