"""
Suite 5 — Legal Pages Tests
TC-LEGAL-01 through TC-LEGAL-04
"""
import pytest
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

from pages.footer import FooterPOM


pytestmark = pytest.mark.legal

DARK_BG  = "rgb(15, 23, 42)"
LIGHT_BG = "rgb(240, 244, 248)"


class TestTermsPage:
    """TC-LEGAL-01 & TC-LEGAL-02: Terms of Conditions page."""

    def test_terms_page_title_visible(self, fresh_driver, base_url):
        """TC-LEGAL-01a: Page title 'TERMS OF CONDITIONS' is rendered."""
        fresh_driver.get(f"{base_url}/terms")
        heading = WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".legal-page-title"))
        )
        assert "TERMS OF CONDITIONS" in heading.text.upper()

    def test_terms_all_16_sections_present(self, fresh_driver, base_url):
        """TC-LEGAL-01b: All 16 numbered sections are present in the DOM."""
        fresh_driver.get(f"{base_url}/terms")
        WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".legal-section-title"))
        )
        section_titles = fresh_driver.find_elements(By.CSS_SELECTOR, ".legal-section-title")
        assert len(section_titles) >= 16, (
            f"Expected at least 16 sections, found {len(section_titles)}"
        )

    def test_terms_back_to_register_link(self, fresh_driver, base_url):
        """TC-LEGAL-01c: 'Back to Register' link points to /register."""
        fresh_driver.get(f"{base_url}/terms")
        back_link = WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".legal-back-link"))
        )
        href = back_link.get_attribute("href")
        assert "/register" in href, f"Back link should point to /register, got {href!r}"

    def test_terms_cta_links_in_footer_note(self, fresh_driver, base_url):
        """TC-LEGAL-01d: Footer action links (Back to Register, Privacy Policy) exist."""
        fresh_driver.get(f"{base_url}/terms")
        WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".legal-action-links"))
        )
        cta = fresh_driver.find_element(By.CSS_SELECTOR, ".legal-cta")
        cta_secondary = fresh_driver.find_element(By.CSS_SELECTOR, ".legal-cta-secondary")
        assert cta.is_displayed()
        assert cta_secondary.is_displayed()

    def test_terms_dark_mode_toggle(self, fresh_driver, base_url):
        """TC-LEGAL-02: Theme toggle on /terms adds .dark class and updates footer."""
        fresh_driver.execute_script("window.localStorage.clear();")
        fresh_driver.get(f"{base_url}/terms")
        root = WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".legal-root"))
        )
        assert "dark" not in root.get_attribute("class"), "Should start in light mode"

        toggle = fresh_driver.find_element(By.CSS_SELECTOR, ".legal-theme-toggle")
        toggle.click()

        WebDriverWait(fresh_driver, 5).until(
            lambda d: "dark" in d.find_element(By.CSS_SELECTOR, ".legal-root").get_attribute("class")
        )
        assert "dark" in root.get_attribute("class"), ".dark class should be added after toggle"

        # Footer background should also switch
        WebDriverWait(fresh_driver, 5).until(
            lambda d: FooterPOM(d).get_background_color() == DARK_BG
        )
        assert FooterPOM(fresh_driver).get_background_color() == DARK_BG

    def test_terms_mailto_links_present(self, fresh_driver, base_url):
        """TC-LEGAL-04: At least 3 mailto: links in terms page."""
        fresh_driver.get(f"{base_url}/terms")
        WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".legal-card"))
        )
        mailto_links = fresh_driver.find_elements(
            By.CSS_SELECTOR, "a[href^='mailto:']"
        )
        assert len(mailto_links) >= 3, (
            f"Expected at least 3 mailto links, found {len(mailto_links)}"
        )


class TestPrivacyPolicyPage:
    """TC-LEGAL-03: Privacy Policy page."""

    def test_privacy_policy_page_loads(self, fresh_driver, base_url):
        """TC-LEGAL-03a: /privacy-policy returns 200 (page renders, no 404)."""
        fresh_driver.get(f"{base_url}/privacy-policy")
        # If it were a 404, Next.js would show "404 | This page could not be found"
        page_text = fresh_driver.find_element(By.TAG_NAME, "body").text
        assert "404" not in page_text, "Privacy Policy page should not 404"
        assert "could not be found" not in page_text.lower()

    def test_privacy_policy_has_heading(self, fresh_driver, base_url):
        """TC-LEGAL-03b: Privacy Policy page has at least one heading."""
        fresh_driver.get(f"{base_url}/privacy-policy")
        headings = WebDriverWait(fresh_driver, 8).until(
            EC.presence_of_all_elements_located((By.XPATH, "//h1 | //h2"))
        )
        assert len(headings) > 0, "Privacy Policy page should have at least one heading"

    def test_privacy_policy_has_footer(self, fresh_driver, base_url):
        """Footer is present on /privacy-policy."""
        fresh_driver.get(f"{base_url}/privacy-policy")
        assert FooterPOM(fresh_driver).is_visible()

    def test_privacy_policy_has_terms_link_in_footer(self, fresh_driver, base_url):
        """Footer on /privacy-policy links back to /terms."""
        fresh_driver.get(f"{base_url}/privacy-policy")
        assert FooterPOM(fresh_driver).has_terms_link()
