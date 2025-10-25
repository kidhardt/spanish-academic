#!/bin/bash

###############################################################################
# Performance Audit Script (Wrapper)
#
# Convenient wrapper for running Lighthouse CI and other performance checks
# Provides quick performance overview before deployment
#
# Usage: bash scripts/performance-audit.sh
#
# Spanish Academic 2026
###############################################################################

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "========================================================================"
echo "⚡ Performance Audit - Spanish Academic 2026"
echo "========================================================================"
echo ""

# Check bundle sizes (if built)
if [ -d "dist" ]; then
    echo -e "${BLUE}📦 Checking bundle sizes...${NC}"
    echo ""

    # Find JavaScript bundles
    JS_BUNDLES=$(find dist -name "*.js" -type f)

    if [ -n "$JS_BUNDLES" ]; then
        TOTAL_SIZE=0
        while IFS= read -r bundle; do
            SIZE=$(stat -f%z "$bundle" 2>/dev/null || stat -c%s "$bundle" 2>/dev/null)
            SIZE_KB=$((SIZE / 1024))
            TOTAL_SIZE=$((TOTAL_SIZE + SIZE))

            FILENAME=$(basename "$bundle")

            # Flag if over 250KB
            if [ $SIZE_KB -gt 250 ]; then
                echo -e "${YELLOW}⚠️  ${FILENAME}: ${SIZE_KB}KB (exceeds 250KB budget)${NC}"
            else
                echo -e "${GREEN}✅ ${FILENAME}: ${SIZE_KB}KB${NC}"
            fi
        done <<< "$JS_BUNDLES"

        TOTAL_KB=$((TOTAL_SIZE / 1024))
        echo ""
        echo "Total JavaScript: ${TOTAL_KB}KB"
        echo ""
    else
        echo "No JavaScript bundles found in dist/"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  dist/ not found. Run 'npm run build' first to check bundle sizes.${NC}"
    echo ""
fi

# Check HTML payload sizes
echo -e "${BLUE}📄 Checking HTML payload sizes...${NC}"
echo ""

HTML_FILES=$(find public -name "*.html" -type f | head -10)

if [ -n "$HTML_FILES" ]; then
    while IFS= read -r html; do
        SIZE=$(stat -f%z "$html" 2>/dev/null || stat -c%s "$html" 2>/dev/null)
        SIZE_KB=$((SIZE / 1024))

        FILENAME=$(echo "$html" | sed 's|^public/||')

        # Flag if over 50KB uncompressed
        if [ $SIZE_KB -gt 50 ]; then
            echo -e "${YELLOW}⚠️  ${FILENAME}: ${SIZE_KB}KB (exceeds 50KB recommendation)${NC}"
        else
            echo -e "${GREEN}✅ ${FILENAME}: ${SIZE_KB}KB${NC}"
        fi
    done <<< "$HTML_FILES"
    echo ""
else
    echo "No HTML files found in public/"
    echo ""
fi

# Run Lighthouse CI
echo "========================================================================"
echo -e "${BLUE}🚀 Running Lighthouse CI...${NC}"
echo "========================================================================"
echo ""

bash scripts/lighthouse_ci.sh

# Exit with Lighthouse CI's exit code
exit $?
