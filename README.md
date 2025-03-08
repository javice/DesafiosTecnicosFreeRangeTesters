# Proyecto de Pruebas Automatizadas con Playwright y POM

Este proyecto utiliza ![Playwright](https://img.shields.io/badge/-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white) y el patrón de diseño **Page Object Model (POM)** para realizar pruebas automatizadas en la página de [Rick and Morty](https://v0-rick-and-morty-api-six.vercel.app/?status=alive). 
Las pruebas validan tanto el frontend como el backend, asegurando que los filtros, la búsqueda y la visualización de datos funcionen correctamente.
Asimismo, este repositorio será el punto de partida para en sucesivas actualizaciones, ir subiendo el resto de desafíos técnicos que se nos propongan desde la página de [Free Range Testers](https://www.freerangetesters.com)
Igualmente, se actualizarán los comandos del Makefile para ejecutar únicamente los tests de cada desafío

---

## 🚀 Configuración del Proyecto

1. **Clona el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/tu-repositorio.git
   cd tu-repositorio
   ```
2. **Instala las dependencias**:

  ```bash
  npm install
  ```
3. **Instala Playwright** (si no se instaló automáticamente):

  ```bash
  npx playwright install
  ```
�‍ Ejecución de Pruebas

Para ejecutar todas las pruebas, usa el siguiente comando:

```bash
npx playwright test
```

Para ejecutar pruebas específicas (por ejemplo, solo las pruebas de frontend):

```bash
npx playwright test tests/frontendTests.spec.js
```

Para ejecutar las pruebas en modo interfaz gráfica (UI):

```bash
npx playwright test --ui
```

---

## 📂 Estructura del Proyecto

```
/project-root
├── /pages           # Páginas del patrón POM
├── /tests           # Pruebas de frontend y backend
├── /utils           # Utilidades (helpers, configuraciones)
├── playwright.config.js  # Configuración de Playwright
├── package.json     # Dependencias y scripts
├── README.md        # Documentación del proyecto
├── CHANGELOG.md     # Historial de 
|--- Makefile       # Comandos de construcción
```

---

## 🚀 Integración Continua (CI)

Este proyecto está configurado con **GitHub Actions** para ejecutar las pruebas automáticamente en cada push o pull request. El archivo de configuración se encuentra en `.github/workflows/ci.yml`.

---

## 🙌 Contribuciones

Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una rama con tu nueva funcionalidad (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Añade nueva funcionalidad"`).
4. Haz push a la rama (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

