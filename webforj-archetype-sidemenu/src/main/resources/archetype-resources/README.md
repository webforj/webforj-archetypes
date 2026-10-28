#set( $symbol_pound = '#' )
${symbol_pound} ${appName}

#if( ${flavor} == "webforj-spring" )
A webforJ application powered by Spring Boot. This project combines the power of webforJ framework with Spring Boot's comprehensive ecosystem for building enterprise applications.
#else
A minimal and ready-to-use starting point for building webforJ applications. This archetype includes the essential setup to help you launch your project quickly and focus on your app logic.
#end

${symbol_pound}${symbol_pound} Prerequisites

- Java 21 or newer  
- Maven 3.9+
#if( ${flavor} == "webforj-bbj" )
- BBj with BBjServices running on this machine
#end

${symbol_pound}${symbol_pound} Getting Started

To run the application in development mode:

```bash
mvn
```

#if( ${flavor} == "webforj-bbj" )
The build publishes the app in the BBjServices of this machine. Then open [http://localhost:8888/webapp/${artifactId}](http://localhost:8888/webapp/${artifactId}) in your browser.
#else
Then open [http://localhost:8080](http://localhost:8080) in your browser.
#end

#if( ${flavor} == "webforj-spring" )
${symbol_pound}${symbol_pound}${symbol_pound} Spring Boot Features

This project leverages Spring Boot's features:

- **Embedded Server**: No need to deploy WAR files, runs as a standalone JAR
- **Auto-configuration**: Spring Boot automatically configures your application
- **Spring Ecosystem**: Easy integration with Spring Data, etc.

${symbol_pound}${symbol_pound}${symbol_pound} Live Class Updates

The project runs with hotswap turned on. The webforJ plugin attaches the class update tool to the application when it starts:

```xml
<hotswap>
  <hotswapAgent/>
</hotswap>
```

Recompile after a change, your IDE's build on save is enough, and the running application picks up the new classes. Open views update in the browser without losing their state.
#elseif( ${flavor} == "webforj-bbj" )
This project is preconfigured to run on **BBjShip**, the webforJ BBj plugin. The first run installs BBjShip in the BBj installation of this machine and sets BBjServices up for development runs. Stopping the build removes the app from BBjServices again.

${symbol_pound}${symbol_pound}${symbol_pound} Live Class Updates

The project runs with hotswap turned on. The webforJ plugin adds the class update tool to the Java settings of BBjServices and restarts BBjServices when it runs without that tool:

```xml
<hotswap>
  <hotswapAgent/>
</hotswap>
```

Recompile after a change, your IDE's build on save is enough, and the running application picks up the new classes. Open views update in the browser without losing their state.
#else
This project is preconfigured to use the **Jetty Maven Plugin**, which makes development faster.

${symbol_pound}${symbol_pound}${symbol_pound} Live Class Updates

The project runs with hotswap turned on. The webforJ plugin attaches the class update tool to the application when it starts:

```xml
<hotswap>
  <hotswapAgent/>
</hotswap>
```

Recompile after a change, your IDE's build on save is enough, and the running application picks up the new classes. Open views update in the browser without losing their state.

Jetty's own scan mode restarts the webapp whenever compiled classes change, which would replace the in place updates with full restarts, so it stays off:

```xml
<jetty.scan>0</jetty.scan>
```

Set it to `1` to fall back to restart based reloading when hotswap is turned off.
#end

${symbol_pound}${symbol_pound} Running Tests

The tests run with the webforJ TestBed, without a browser or a server:

```bash
mvn test
```

#if( ${flavor} == "webforj-spring" )
Each test launches the application inside the Spring test context, so views receive their beans, then navigates to a view, interacts with its components and asserts their state.
#else
Each test launches the application, navigates to a view, interacts with its components and asserts their state.
#end

#if( ${flavor} == "webforj-spring" )
${symbol_pound}${symbol_pound} Spring Boot Configuration

Configuration lives in `src/main/resources/`:

- `application.properties` contains shared defaults, with development features disabled.
- `application-dev.properties` enables development features and immediate shutdown.
- `application-prod.properties` inherits shared defaults and is ready for production overrides.

Spring loads the shared file and overrides individual settings from the active profile.
Keep common settings in the shared file, for example:

```properties
# Application name
spring.application.name=${appName}

# Server configuration
server.port=8080

# Add your custom configurations here
```
#end

${symbol_pound}${symbol_pound} Building for Production

#if( ${flavor} == "webforj-spring" )
To create an executable JAR:

```bash
mvn clean package
java -jar target/${artifactId}-${version}.jar --spring.profiles.active=prod
```

The same JAR can run in each environment. Without a profile argument or external
profile selection, it uses shared defaults. Neither `dev` nor `prod` is active.
Select a profile with `--spring.profiles.active=prod` or `SPRING_PROFILES_ACTIVE=prod`.
Environment variables and command-line arguments can override individual settings.

Plain `mvn` activates Spring's `dev` profile through `spring-boot.run.profiles`.
Override it with `mvn -Dspring-boot.run.profiles=prod`. No Maven profiles are needed.
This Maven run default does not affect the packaged JAR.

Or build and run a Docker image:

```bash
# Build the Docker image
mvn spring-boot:build-image

# Run the Docker container
docker run -p 8080:8080 ${artifactId}:${version}

# Or run with environment variables
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod ${artifactId}:${version}
```
#elseif( ${flavor} == "webforj-bbj" )
To build the app for production and deploy it to BBjShip:

```bash
mvn clean install -Pprod
```

The build writes the deployment archive `target/bbj/${artifactId}.zip` and deploys it to BBjShip at `http://localhost:8888/webforj-bbjship`. To write the archive without deploying it:

```bash
mvn clean package -Pprod
```
#else
To create a WAR file for deployment:

```bash
mvn clean package -Pprod
```

The WAR file will be created in `target/${artifactId}-${version}.war`
#end

${symbol_pound}${symbol_pound} Learn More

Explore the webforJ ecosystem through our documentation and examples:

- [Full Documentation](https://docs.webforj.com)
- [Component Overview](https://docs.webforj.com/docs/components/overview)
- [Quick Tutorial](https://docs.webforj.com/docs/introduction/tutorial/overview)
- [Advanced Topics](https://docs.webforj.com/docs/advanced/overview)
#if( ${flavor} == "webforj-spring" )

${symbol_pound}${symbol_pound}${symbol_pound} Spring Boot Resources

- [Spring Boot Documentation](https://spring.io/projects/spring-boot)
- [Spring Boot Reference Guide](https://docs.spring.io/spring-boot/docs/current/reference/html/)
#end