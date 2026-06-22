# AGENTS.md

This is a webforJ project: the UI is built by composing webforJ components in Java.

## Commands

- `mvn` — dev mode. The default goal (`compile webforj:watch <run>`) compiles the frontend, watches `src/main/frontend`, and serves the app.
- `mvn verify` — run the `*IT` integration tests (Playwright).
- `mvn -Pprod package` — production build into `target/`.

Java version, dependencies, plugins, and the run goal are declared in `pom.xml` — read them there instead of assuming.

## Layout

- `src/main/java/.../Application.java` — entry point, `extends App`. `@Routify` scans the `views` package and `@BundleEntry("app.css")` loads the app stylesheet.
- `src/main/java/.../views/` — routes. Each is a `@Route`-annotated `Composite`.
- `src/main/frontend/` — frontend sources compiled by the webforJ Maven plugin. `app.css` lives here.
- `src/main/resources/` — `webforj.conf`, or `application.properties` on Spring, for runtime config.

## webforJ MCP server

Configured in this repo (`https://mcp.webforj.com/mcp`) via `.mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `.codex/config.toml`, and `.junie/mcp/mcp.json`.

- Resolve the webforJ version from `pom.xml`, and scope every answer to it.
- Look up webforJ classes, methods, and annotations through the server — don't guess them.
- Validate every `--dwc-*` CSS token through the server before using it.

## Rules

- Style with DWC tokens (`--dwc-*`). Set the app color via `--dwc-color-primary-seed` in `src/main/frontend/app.css`. Don't hardcode colors.
- Run `mvn verify` before finishing.
