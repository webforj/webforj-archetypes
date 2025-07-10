import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths

// Get the flavor property
def flavor = request.properties.get("flavor")
def projectPath = Paths.get(request.outputDirectory, request.artifactId)
def packagePath = request.properties.get("package").replace(".", "/")
def testPath = projectPath.resolve("src/test/java").resolve(packagePath).resolve("views")

if (flavor == "webforj-spring") {
    // For Spring flavor, delete the regular test and rename the Spring test
    def regularTest = testPath.resolve("HelloWorldViewIT.java")
    def springTest = testPath.resolve("HelloWorldViewSpringIT.java")
    
    if (Files.exists(regularTest)) {
        Files.delete(regularTest)
    }
    
    if (Files.exists(springTest)) {
        Files.move(springTest, regularTest)
    }
} else {
    // For regular webforj flavor, delete the Spring test
    def springTest = testPath.resolve("HelloWorldViewSpringIT.java")
    
    if (Files.exists(springTest)) {
        Files.delete(springTest)
    }
}