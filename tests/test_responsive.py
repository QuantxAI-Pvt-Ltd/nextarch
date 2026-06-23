"""
Suite 6 — Responsive & Accessibility Tests
TC-RESP-01 through TC-RESP-03
"""
import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains

from pages.footer import FooterPOM


pytestmark = pytest.mark.responsive

MOBILE_W, MOBILE_H   = 390, 844     # iPhone 14 Pro
TABLET_W, TABLET_H   = 768, 1024    # iPad
DESKTOP_W, DESKTOP_H = 1440, 900


class TestMobileViewport:
    """TC-RESP-01: Mobile sidebar and hamburger menu."""

    def test_sidebar_hidden_by_default_on_mobile(self, logged_in, base_url):
        """TC-RESP-01a: Sidebar is off-screen on mobile viewport."""
        logged_in.set_window_size(MOBILE_W, MOBILE_H)
        try:
            logged_in.get(f"{base_url}/calculator")
            WebDriverWait(logged_in, 8).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "aside"))
            )
            sidebar = logged_in.find_element(By.CSS_SELECTOR, "aside")
            # On mobile the sidebar has -translate-x-full (rendered off-screen)
            # Its x position should be negative or its width < visible area
            rect = logged_in.execute_script(
                "return arguments[0].getBoundingClientRect();", sidebar
            )
            assert rect["right"] <= 0 or rect["x"] < -50, (
                f"Sidebar should be off-screen on mobile, x={rect['x']:.0f}"
            )
        finally:
            logged_in.set_window_size(DESKTOP_W, DESKTOP_H)

    def test_hamburger_button_visible_on_mobile(self, logged_in, base_url):
        """TC-RESP-01b: Hamburger menu button appears on mobile."""
        logged_in.set_window_size(MOBILE_W, MOBILE_H)
        try:
            logged_in.get(f"{base_url}/calculator")
            WebDriverWait(logged_in, 8).until(
                EC.presence_of_element_located((By.CSS_SELECTOR, "header"))
            )
            # Mobile menu button is .p-2.-ml-2 (md:hidden)
            hamburger = logged_in.find_element(By.CSS_SELECTOR, "header button.p-2.-ml-2")
            assert hamburger.is_displayed(), "Hamburger button should be visible on mobile"
        finally:
            logged_in.set_window_size(DESKTOP_W, DESKTOP_H)

    def test_hamburger_opens_sidebar_on_mobile(self, logged_in, base_url):
        """TC-RESP-01c: Tapping hamburger slides the sidebar in."""
        logged_in.set_window_size(MOBILE_W, MOBILE_H)
        try:
            logged_in.get(f"{base_url}/calculator")
            WebDriverWait(logged_in, 8).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "header button.p-2.-ml-2"))
            )
            hamburger = logged_in.find_element(By.CSS_SELECTOR, "header button.p-2.-ml-2")
            hamburger.click()

            WebDriverWait(logged_in, 5).until(lambda d: (
                d.find_element(By.CSS_SELECTOR, "aside")
                 .value_of_css_property("transform") != "matrix(1, 0, 0, 1, -288, 0)"
            ))
            sidebar = logged_in.find_element(By.CSS_SELECTOR, "aside")
            rect = logged_in.execute_script(
                "return arguments[0].getBoundingClientRect();", sidebar
            )
            assert rect["x"] >= -10, f"Sidebar should slide in (x={rect['x']:.0f})"
        finally:
            logged_in.set_window_size(DESKTOP_W, DESKTOP_H)


class TestMobileFooter:
    """TC-RESP-02: Footer readability on mobile."""

    def test_footer_visible_on_mobile(self, fresh_driver, base_url):
        """TC-RESP-02a: Footer renders and is visible on 390px width."""
        fresh_driver.set_window_size(MOBILE_W, MOBILE_H)
        try:
            fresh_driver.get(f"{base_url}/login")
            footer = FooterPOM(fresh_driver)
            footer.scroll_into_view()
            assert footer.is_visible(), "Footer should be visible on mobile"
        finally:
            fresh_driver.set_window_size(DESKTOP_W, DESKTOP_H)

    def test_footer_does_not_overflow_on_mobile(self, fresh_driver, base_url):
        """TC-RESP-02b: Footer items don't extend beyond the viewport width."""
        fresh_driver.set_window_size(MOBILE_W, MOBILE_H)
        try:
            fresh_driver.get(f"{base_url}/login")
            footer = FooterPOM(fresh_driver)
            footer.scroll_into_view()
            footer_el = footer.element()
            rect = fresh_driver.execute_script(
                "return arguments[0].getBoundingClientRect();", footer_el
            )
            assert rect["right"] <= MOBILE_W + 5, (
                f"Footer extends past viewport: right={rect['right']:.0f} > {MOBILE_W}"
            )
        finally:
            fresh_driver.set_window_size(DESKTOP_W, DESKTOP_H)

    def test_footer_links_clickable_on_mobile(self, fresh_driver, base_url):
        """TC-RESP-02c: Privacy Policy link is tappable on mobile."""
        fresh_driver.set_window_size(MOBILE_W, MOBILE_H)
        try:
            fresh_driver.get(f"{base_url}/login")
            FooterPOM(fresh_driver).scroll_into_view()
            FooterPOM(fresh_driver).click_privacy_policy()
            WebDriverWait(fresh_driver, 8).until(EC.url_contains("/privacy-policy"))
            assert "/privacy-policy" in fresh_driver.current_url
        finally:
            fresh_driver.set_window_size(DESKTOP_W, DESKTOP_H)


class TestKeyboardAccessibility:
    """TC-RESP-03: Login form is usable with keyboard only."""

    def test_login_form_keyboard_navigation(self, fresh_driver, base_url, credentials):
        """TC-RESP-03: Tab through email → password → submit via keyboard."""
        fresh_driver.delete_all_cookies()
        fresh_driver.execute_script("window.localStorage.clear();")
        fresh_driver.get(f"{base_url}/login")

        body = fresh_driver.find_element(By.TAG_NAME, "body")
        actions = ActionChains(fresh_driver)

        # Focus email input and type
        email_input = fresh_driver.find_element(By.NAME, "login_email")
        email_input.click()
        email_input.send_keys(credentials["email"])

        # Tab to password
        email_input.send_keys(Keys.TAB)
        active = fresh_driver.switch_to.active_element
        active.send_keys(credentials["password"])

        # Tab to LOGIN button and press Enter
        active.send_keys(Keys.TAB)
        submit_btn = fresh_driver.switch_to.active_element
        submit_btn.send_keys(Keys.RETURN)

        WebDriverWait(fresh_driver, 10).until(EC.url_contains("/calculator"))
        assert "/calculator" in fresh_driver.current_url, (
            "Keyboard-only login should redirect to /calculator"
        )

    def test_footer_links_are_tab_focusable(self, fresh_driver, base_url):
        """Footer links should be reachable via keyboard tabbing."""
        fresh_driver.get(f"{base_url}/login")
        footer_links = fresh_driver.find_elements(By.CSS_SELECTOR, "footer a")
        for link in footer_links:
            # Each anchor should be focusable (tabindex not -1)
            tab_idx = link.get_attribute("tabindex")
            assert tab_idx != "-1", f"Footer link '{link.text}' should not have tabindex=-1"
