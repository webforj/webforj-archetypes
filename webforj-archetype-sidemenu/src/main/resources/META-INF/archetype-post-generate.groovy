import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

// Get the flavor property
def flavor = request.properties.get("flavor")
def projectPath = Paths.get(request.outputDirectory, request.artifactId)
def packagePath = request.properties.get("package").replace(".", "/")
def testPath = projectPath.resolve("src/test/java").resolve(packagePath).resolve("views")

if (flavor == "webforj-spring") {
    def instructions = projectPath.resolve("AGENTS.md")
    Files.writeString(instructions, Files.readString(instructions).replace(
        "- `mvn -Pprod package` — production build into `target/`.",
        "- `mvn package` — build the executable JAR into `target/`.\n" +
        "- Run the JAR with `--spring.profiles.active=prod` for production overrides. Without a profile it uses shared defaults."))

    // For Spring flavor, delete the regular test and rename the Spring test
    def regularTest = testPath.resolve("DashboardViewIT.java")
    def springTest = testPath.resolve("DashboardViewSpringIT.java")

    if (Files.exists(regularTest)) {
        Files.delete(regularTest)
    }

    if (Files.exists(springTest)) {
        Files.move(springTest, regularTest)
    }
} else if (flavor == "webforj-bbj") {
    def instructions = projectPath.resolve("AGENTS.md")
    def text = Files.readString(instructions)
        .replaceAll(/(?s)## Testing\n.*?(?=## )/, "")
        .readLines()
        .findAll { !it.contains("`mvn verify`") }
        .join("\n") + "\n"
    Files.writeString(instructions, text
        .replace("`mvn -Pprod package`", "`mvn -Pprod install`")
        .replace("production build into `target/`.", "production build, deployed to BBjShip."))

    // For BBj flavor, the deploy runs at install after the integration tests, so the project has no tests
    projectPath.resolve("src/test").toFile().deleteDir()
} else {
    // For regular webforj flavor, delete the Spring test
    def springTest = testPath.resolve("DashboardViewSpringIT.java")

    if (Files.exists(springTest)) {
        Files.delete(springTest)
    }
}
