"""
Suite 3 — Calculator Tests
TC-CALC-01 through TC-CALC-06
"""
import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from pages.calculator_page import CalculatorPage, CALCULATOR_MODES
from pages.footer import FooterPOM


pytestmark = pytest.mark.calculator

LIGHT_BG = "rgb(240, 244, 248)"
DARK_BG  = "rgb(8, 12, 21)"  # ThemedShell dark = #080C15


class TestCalculatorDashboard:
    """TC-CALC-01 & TC-CALC-02: Initial load."""

    def test_calculator_loads_with_sidebar_and_header(self, logged_in, base_url):
        """TC-CALC-01: Sidebar and header are visible after login."""
        page = CalculatorPage(logged_in, base_url).open()
        page.wait_for_content()
        assert logged_in.find_element(By.CSS_SELECTOR, "aside").is_displayed()
        assert logged_in.find_element(By.CSS_SELECTOR, "header").is_displayed()

    def test_brand_name_in_header(self, logged_in, base_url):
        """TC-CALC-01b: 'Ventwise' brand text appears in header."""
        CalculatorPage(logged_in, base_url).open().wait_for_content()
        header_texts = [
            el.text for el in logged_in.find_elements(By.CSS_SELECTOR, "header span")
        ]
        assert any("Ventwise" in t for t in header_texts), "Ventwise brand should be in header"

    def test_default_mode_is_window_calculations(self, logged_in, base_url):
        """TC-CALC-02: Default ?mode is window-calculations."""
        CalculatorPage(logged_in, base_url).open()
        WebDriverWait(logged_in, 8).until(EC.url_contains("/calculator"))
        page = CalculatorPage(logged_in, base_url)
        mode = page.get_current_mode()
        assert mode == "window-calculations", f"Expected default mode, got '{mode}'"


class TestCalculatorModuleNavigation:
    """TC-CALC-03: All 6 modules are navigable via sidebar."""

    @pytest.mark.parametrize("mode,label", list(CALCULATOR_MODES.items()))
    def test_sidebar_module_navigation(self, logged_in, base_url, mode, label):
        """TC-CALC-03: Clicking each sidebar item updates URL and renders content."""
        CalculatorPage(logged_in, base_url).open()
        WebDriverWait(logged_in, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "aside nav a"))
        )
        # Click the sidebar link for this mode
        link = logged_in.find_element(
            By.CSS_SELECTOR, f"aside nav a[href*='mode={mode}']"
        )
        link.click()
        WebDriverWait(logged_in, 8).until(EC.url_contains(f"mode={mode}"))

        assert mode in logged_in.current_url, f"URL should contain mode={mode}"
        # Main content should still render (not blank)
        assert logged_in.find_element(By.CSS_SELECTOR, "main").is_displayed()


class TestSidebarCollapse:
    """TC-CALC-04: Sidebar collapse/expand toggle."""

    def test_sidebar_collapses_and_expands(self, logged_in, base_url):
        """TC-CALC-04: Collapse button toggles sidebar width."""
        page = CalculatorPage(logged_in, base_url).open()
        WebDriverWait(logged_in, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "aside"))
        )
        sidebar = logged_in.find_element(By.CSS_SELECTOR, "aside")
        initial_width = sidebar.size["width"]

        # Find and click collapse button (desktop only — visible md+)
        collapse_btns = logged_in.find_elements(
            By.CSS_SELECTOR, "aside button.absolute.-right-3"
        )
        if not collapse_btns:
            pytest.skip("Collapse button not visible at current viewport width")

        collapse_btns[0].click()
        WebDriverWait(logged_in, 5).until(
            lambda d: d.find_element(By.CSS_SELECTOR, "aside").size["width"] != initial_width
        )
        collapsed_width = logged_in.find_element(By.CSS_SELECTOR, "aside").size["width"]
        assert collapsed_width < initial_width, "Sidebar should be narrower when collapsed"

        # Expand again
        collapse_btns[0].click()
        WebDriverWait(logged_in, 5).until(
            lambda d: d.find_element(By.CSS_SELECTOR, "aside").size["width"] != collapsed_width
        )
        expanded_width = logged_in.find_element(By.CSS_SELECTOR, "aside").size["width"]
        assert expanded_width > collapsed_width, "Sidebar should expand back"


class TestCalculatorTheme:
    """TC-CALC-05: Theme toggle in calculator header syncs to footer."""

    def test_theme_toggle_dropdown_opens(self, logged_in, base_url):
        """Theme button click opens light/dark dropdown."""
        CalculatorPage(logged_in, base_url).open().wait_for_content()
        theme_btn = WebDriverWait(logged_in, 8).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, "header button[aria-label='Toggle theme']"))
        )
        theme_btn.click()
        # Dropdown with Light Mode / Dark Mode buttons should appear
        WebDriverWait(logged_in, 5).until(
            EC.presence_of_element_located(
                (By.XPATH, "//button[contains(., 'Light Mode') or contains(., 'Dark Mode')]")
            )
        )
        opts = logged_in.find_elements(
            By.XPATH, "//button[contains(., 'Light Mode') or contains(., 'Dark Mode')]"
        )
        assert len(opts) == 2, "Dropdown should have Light Mode and Dark Mode options"

    def test_switching_to_light_updates_footer(self, logged_in, base_url):
        """TC-CALC-05: Selecting Light Mode → footer background = light."""
        page = CalculatorPage(logged_in, base_url)
        page.open().wait_for_content()
        page.select_light_mode()
        WebDriverWait(logged_in, 6).until(
            lambda d: FooterPOM(d).get_background_color() == LIGHT_BG
        )
        assert FooterPOM(logged_in).get_background_color() == LIGHT_BG

    def test_switching_to_dark_updates_footer(self, logged_in, base_url):
        """TC-CALC-05b: Selecting Dark Mode → footer background = dark."""
        page = CalculatorPage(logged_in, base_url)
        page.open().wait_for_content()
        page.select_dark_mode()
        footer_dark = "rgb(15, 23, 42)"   # #0f172a stored in global context
        WebDriverWait(logged_in, 6).until(
            lambda d: FooterPOM(d).get_background_color() == footer_dark
        )
        assert FooterPOM(logged_in).get_background_color() == footer_dark
