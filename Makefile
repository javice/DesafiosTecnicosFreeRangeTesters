# Colores para la terminal
CYAN=\033[0;36m
GREEN=\033[0;32m
RED=\033[0;31m
YELLOW=\033[0;33m
NC=\033[0m # No Color

# Comandos principales
.PHONY: install test test-headed test-ui report visual-update visual-test clean

install:
	@echo "${CYAN}Configurando Playwright...${NC}"
	npm install
	npx playwright install

test:
	@echo "${CYAN}Ejecutando todas las pruebas...${NC}"
	npx playwright test --workers=1

test-headed:
	@echo "${CYAN}Ejecutando pruebas en modo headed...${NC}"
	npx playwright test --headed --workers=1

test-ui:
	@echo "${CYAN}Ejecutando pruebas en modo UI...${NC}"
	npx playwright test --ui

test-verbose:
	@echo "${CYAN}Ejecutando pruebas con mensajes detallados...${NC}"
	npx playwright test --workers=1

report:
	@echo "${CYAN}Generando y abriendo el reporte HTML...${NC}"
	npx playwright show-report

clean:
	@echo "${RED}Limpiando reportes y snapshots...${NC}"
	rm -rf playwright-report test-results

help:
	@echo "${GREEN}Comandos disponibles:${NC}"
	@echo "  ${CYAN}install${NC}        - Instala dependencias y configura Playwright."
	@echo "  ${CYAN}test${NC}           - Ejecuta todas las pruebas en modo headless."
	@echo "  ${CYAN}test-headed${NC}    - Ejecuta pruebas con el navegador visible (modo headed)."
	@echo "  ${CYAN}test-ui${NC}        - Ejecuta pruebas en la interfaz gráfica de Playwright."
	@echo "  ${CYAN}test-verbose${NC}   - Ejecuta pruebas con mensajes detallados."
	@echo "  ${CYAN}report${NC}         - Genera y abre el reporte HTML de las pruebas."
	@echo "  ${CYAN}clean${NC}          - Elimina reportes y snapshots generados."
	@echo "  ${CYAN}help${NC}           - Muestra esta ayuda."