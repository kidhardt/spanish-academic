#!/bin/bash

###############################################################################
# Pre-Deployment Validation Script
#
# Complete validation workflow before deploying to production:
# 1. Run all static validation scripts (validate-all)
# 2. Build the project
# 3. Start preview server
# 4. Run Lighthouse CI to enforce mobile score >90
# 5. Clean up preview server
#
# BLOCKS deployment if ANY validation fails
#
# Usage: npm run pre-deploy
#
# Spanish Academic 2026
###############################################################################

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================================================"
echo "🚀 Pre-Deployment Validation"
echo "========================================================================"
echo ""

# Track PID of preview server for cleanup
PREVIEW_PID=""

# Cleanup function
cleanup() {
    if [ -n "$PREVIEW_PID" ]; then
        echo ""
        echo "🧹 Stopping preview server (PID: $PREVIEW_PID)..."
        kill $PREVIEW_PID 2>/dev/null || true
        wait $PREVIEW_PID 2>/dev/null || true
        echo -e "${GREEN}✅ Preview server stopped${NC}"
    fi
}

# Set trap to ensure cleanup on exit
trap cleanup EXIT INT TERM

echo "──────────────────────────────────────────────────────────────────────"
echo "Step 1/4: Running static validation scripts"
echo "──────────────────────────────────────────────────────────────────────"
echo ""

if npm run validate-all; then
    echo ""
    echo -e "${GREEN}✅ All static validations passed${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Static validation failed${NC}"
    echo -e "${YELLOW}💡 Fix validation errors before deployment${NC}"
    exit 1
fi

echo "──────────────────────────────────────────────────────────────────────"
echo "Step 2/4: Building project"
echo "──────────────────────────────────────────────────────────────────────"
echo ""

if npm run build; then
    echo ""
    echo -e "${GREEN}✅ Build successful${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Build failed${NC}"
    echo -e "${YELLOW}💡 Fix build errors before deployment${NC}"
    exit 1
fi

echo "──────────────────────────────────────────────────────────────────────"
echo "Step 3/4: Starting preview server"
echo "──────────────────────────────────────────────────────────────────────"
echo ""

# Start preview server in background
npm run preview &
PREVIEW_PID=$!

echo "Preview server PID: $PREVIEW_PID"
echo "Waiting for server to start..."

# Wait for server to be ready (max 30 seconds)
WAIT_TIME=0
MAX_WAIT=30
SERVER_URL="http://localhost:4173"

while [ $WAIT_TIME -lt $MAX_WAIT ]; do
    if curl -s --head --fail "$SERVER_URL" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Preview server is ready${NC}"
        echo ""
        break
    fi
    sleep 1
    WAIT_TIME=$((WAIT_TIME + 1))
done

if [ $WAIT_TIME -ge $MAX_WAIT ]; then
    echo -e "${RED}❌ Preview server failed to start within ${MAX_WAIT} seconds${NC}"
    exit 1
fi

echo "──────────────────────────────────────────────────────────────────────"
echo "Step 4/4: Running Lighthouse CI (mobile score >90 enforcement)"
echo "──────────────────────────────────────────────────────────────────────"
echo ""

if LIGHTHOUSE_BASE_URL="$SERVER_URL" npm run lighthouse; then
    echo ""
    echo -e "${GREEN}✅ Lighthouse CI passed - mobile score >90${NC}"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Lighthouse CI failed - mobile score <90${NC}"
    echo -e "${YELLOW}💡 Fix performance issues before deployment${NC}"
    echo -e "${YELLOW}💡 View detailed reports in lighthouse-reports/${NC}"
    exit 1
fi

echo "========================================================================"
echo "✅ PRE-DEPLOYMENT VALIDATION COMPLETE"
echo "========================================================================"
echo ""
echo -e "${GREEN}🚀 All checks passed - ready for production deployment${NC}"
echo ""
echo "Next steps:"
echo "  1. Review lighthouse reports in lighthouse-reports/"
echo "  2. Deploy to production: npm run deploy"
echo ""

exit 0
