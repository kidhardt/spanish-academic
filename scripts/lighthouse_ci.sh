#!/bin/bash

###############################################################################
# Lighthouse CI Script
#
# Runs Lighthouse performance audits on key pages and enforces mobile score >90
# Tests Core Web Vitals (LCP, FID, CLS) and blocks deployment if standards not met
#
# IMPORTANT: This script requires pages to be served via HTTP server
# Run: npm run preview  (in another terminal)
# Then: npm run lighthouse
#
# Usage: npm run lighthouse
#
# Spanish Academic 2026
###############################################################################

set -e  # Exit on error

# Configuration
MIN_MOBILE_SCORE=90
LIGHTHOUSE_CMD="npx lighthouse"
OUTPUT_DIR="lighthouse-reports"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BASE_URL="${LIGHTHOUSE_BASE_URL:-http://localhost:4173}"  # Vite preview default port

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Pages to test (relative URLs)
PAGES=(
  "/"
  "/es/"
  "/test-page.html"
  "/insights/test-article.html"
  "/insights/categories/research-methods.html"
)

# Create output directory
mkdir -p "$OUTPUT_DIR"

echo "========================================================================"
echo "🚀 Lighthouse CI Performance Audit"
echo "========================================================================"
echo ""
echo "Base URL: ${BASE_URL}"
echo "Minimum mobile score required: ${MIN_MOBILE_SCORE}"
echo "Testing ${#PAGES[@]} page(s)"
echo ""

# Check if Lighthouse is available
if ! command -v lighthouse &> /dev/null; then
    echo -e "${YELLOW}⚠️  Lighthouse CLI not found globally. Using npx...${NC}"
fi

# Check if server is running
echo "Checking if server is running at ${BASE_URL}..."
if ! curl -s --head --fail "${BASE_URL}" > /dev/null 2>&1; then
    echo -e "${RED}❌ Server not running at ${BASE_URL}${NC}"
    echo -e "${YELLOW}💡 Start the preview server first:${NC}"
    echo -e "${YELLOW}   npm run build && npm run preview${NC}"
    echo -e "${YELLOW}   (in another terminal)${NC}"
    echo ""
    echo -e "${YELLOW}Or set custom URL:${NC}"
    echo -e "${YELLOW}   export LIGHTHOUSE_BASE_URL=http://localhost:3000${NC}"
    echo -e "${YELLOW}   npm run lighthouse${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Server is running${NC}"
echo ""

# Track overall results
TOTAL_PAGES=0
PASSED_PAGES=0
FAILED_PAGES=0
declare -a FAILED_PAGE_LIST

# Test each page
for PAGE in "${PAGES[@]}"; do
    TOTAL_PAGES=$((TOTAL_PAGES + 1))

    # Construct full URL
    PAGE_URL="${BASE_URL}${PAGE}"

    echo "──────────────────────────────────────────────────────────────────────"
    echo -e "${BLUE}Testing: ${PAGE}${NC}"
    echo "URL: ${PAGE_URL}"
    echo "──────────────────────────────────────────────────────────────────────"

    # Output file name
    REPORT_NAME=$(echo "$PAGE" | sed 's/\//_/g' | sed 's/.html$//' | sed 's/^_//')
    if [ -z "$REPORT_NAME" ]; then
        REPORT_NAME="index"
    fi
    JSON_OUTPUT="${OUTPUT_DIR}/${REPORT_NAME}_${TIMESTAMP}.json"
    HTML_OUTPUT="${OUTPUT_DIR}/${REPORT_NAME}_${TIMESTAMP}.html"

    # Run Lighthouse (mobile)
    echo "Running Lighthouse audit (mobile)..."

    $LIGHTHOUSE_CMD "$PAGE_URL" \
        --output=json \
        --output=html \
        --output-path="${OUTPUT_DIR}/${REPORT_NAME}_${TIMESTAMP}" \
        --chrome-flags="--headless --no-sandbox --disable-gpu" \
        --emulated-form-factor=mobile \
        --throttling-method=simulate \
        --quiet \
        2>&1 | grep -v "^$" || true

    # Parse JSON results
    if [ -f "${JSON_OUTPUT}" ]; then
        # Extract scores (0-100)
        PERFORMANCE=$(node -e "const data=require('./${JSON_OUTPUT}'); console.log(Math.round(data.categories.performance.score * 100));")
        ACCESSIBILITY=$(node -e "const data=require('./${JSON_OUTPUT}'); console.log(Math.round(data.categories.accessibility.score * 100));")
        BEST_PRACTICES=$(node -e "const data=require('./${JSON_OUTPUT}'); console.log(Math.round(data.categories['best-practices'].score * 100));")
        SEO=$(node -e "const data=require('./${JSON_OUTPUT}'); console.log(Math.round(data.categories.seo.score * 100));")

        # Extract Core Web Vitals
        LCP=$(node -e "const data=require('./${JSON_OUTPUT}'); const lcp=data.audits['largest-contentful-paint']; console.log(lcp.displayValue || 'N/A');")
        FID=$(node -e "const data=require('./${JSON_OUTPUT}'); const fid=data.audits['max-potential-fid']; console.log(fid.displayValue || 'N/A');")
        CLS=$(node -e "const data=require('./${JSON_OUTPUT}'); const cls=data.audits['cumulative-layout-shift']; console.log(cls.displayValue || 'N/A');")

        echo ""
        echo "📊 Scores:"
        echo "   Performance:    ${PERFORMANCE}/100"
        echo "   Accessibility:  ${ACCESSIBILITY}/100"
        echo "   Best Practices: ${BEST_PRACTICES}/100"
        echo "   SEO:            ${SEO}/100"
        echo ""
        echo "⚡ Core Web Vitals:"
        echo "   LCP (Largest Contentful Paint): ${LCP}"
        echo "   FID (First Input Delay):        ${FID}"
        echo "   CLS (Cumulative Layout Shift):  ${CLS}"
        echo ""

        # Check if performance meets minimum
        if [ "$PERFORMANCE" -ge "$MIN_MOBILE_SCORE" ]; then
            echo -e "${GREEN}✅ PASSED - Mobile score: ${PERFORMANCE}/100${NC}"
            PASSED_PAGES=$((PASSED_PAGES + 1))
        else
            echo -e "${RED}❌ FAILED - Mobile score: ${PERFORMANCE}/100 (minimum: ${MIN_MOBILE_SCORE})${NC}"
            FAILED_PAGES=$((FAILED_PAGES + 1))
            FAILED_PAGE_LIST+=("${PAGE} (score: ${PERFORMANCE})")
        fi

        echo "📄 Reports saved:"
        echo "   JSON: ${JSON_OUTPUT}"
        echo "   HTML: ${HTML_OUTPUT}"
        echo ""
    else
        echo -e "${RED}❌ Failed to generate Lighthouse report${NC}"
        FAILED_PAGES=$((FAILED_PAGES + 1))
        FAILED_PAGE_LIST+=("${PAGE} (report generation failed)")
    fi
done

# Summary
echo "========================================================================"
echo "📊 SUMMARY"
echo "========================================================================"
echo "✅ Passed:  ${PASSED_PAGES}/${TOTAL_PAGES} page(s)"
echo "❌ Failed:  ${FAILED_PAGES}/${TOTAL_PAGES} page(s)"
echo ""

if [ ${FAILED_PAGES} -gt 0 ]; then
    echo -e "${RED}Failed pages:${NC}"
    for FAILED_PAGE in "${FAILED_PAGE_LIST[@]}"; do
        echo -e "${RED}  • ${FAILED_PAGE}${NC}"
    done
    echo ""
    echo -e "${RED}❌ Lighthouse CI failed - mobile score <${MIN_MOBILE_SCORE} on some pages${NC}"
    echo -e "${YELLOW}💡 Fix performance issues before deployment${NC}"
    echo -e "${YELLOW}💡 View detailed reports in ${OUTPUT_DIR}/${NC}"
    exit 1
else
    echo -e "${GREEN}✅ All pages passed Lighthouse CI!${NC}"
    echo -e "${GREEN}🚀 Performance standards met - ready for deployment${NC}"
    exit 0
fi
