#!/bin/bash

# Eventato - Installation Script
# This script installs the eventato CLI tool

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Eventato - Installation Script${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 16+ first.${NC}"
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo -e "${RED}❌ Node.js version 16+ is required. Current version: $(node -v)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node -v) detected${NC}"

# Check if Cursor is installed
if ! command -v cursor-agent &> /dev/null; then
    echo -e "${YELLOW}⚠️  Cursor CLI not found. Please ensure Cursor is installed and cursor-agent is in your PATH.${NC}"
    echo "Visit: https://cursor.com/"
    echo ""
fi

# Install the package globally
echo -e "${BLUE}📦 Installing eventato...${NC}"

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not available. Please install npm first.${NC}"
    exit 1
fi

# Install globally
npm install -g .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ eventato installed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🎉 You're all set!${NC}"
    echo ""
    echo "Usage:"
    echo "  eventato add-events --help"
    echo "  eventato add-events --feature 'My Feature'"
    echo ""
    echo "For more information, visit: https://github.com/RiccLQL/eventato"
else
    echo -e "${RED}❌ Installation failed. Please try again.${NC}"
    exit 1
fi
