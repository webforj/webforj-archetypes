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

${symbol_pound}${symbol_pound} Getting Started

To run the application in development mode:

```bash
#if( ${flavor} == "webforj-spring" )
mvn spring-boot:run
#else
mvn jetty:run
#end
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

#if( ${flavor} == "webforj-spring" )
${symbol_pound}${symbol_pound}${symbol_pound} Spring Boot Features

This project leverages Spring Boot's features:

- **Embedded Server**: No need to deploy WAR files, runs as a standalone JAR
- **Auto-configuration**: Spring Boot automatically configures your application
- **DevTools**: Automatic restart when code changes (included by default)
- **Spring Ecosystem**: Easy integration with Spring Data, etc.

${symbol_pound}${symbol_pound}${symbol_pound} Hot Reload with DevTools

Spring Boot DevTools is included for automatic application restart:

```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-devtools</artifactId>
  <optional>true</optional>
</dependency>
```

Your application will automatically restart when files on the classpath change.

#else
This project is preconfigured to use the **Jetty Maven Plugin**, which makes development faster. It includes automatic scanning for class and resource changes.

${symbol_pound}${symbol_pound}${symbol_pound} Jetty Auto-Reload (Hot Deployment)

By default, this project enables **Jetty's scan mode** using the following property:

```xml
<jetty.scan>1</jetty.scan>
```

This means Jetty will **poll for changes in compiled classes and resources every second**, allowing the app to **auto-reload** without restarting the server. This is great for quick feedback while developing UI or backend logic.

If you're using a live reload tool (like JRebel or similar), you may want to set this to `0` to disable it.

```xml
<jetty.scan>0</jetty.scan>
```
#end

${symbol_pound}${symbol_pound} Running Integration Tests

To run end-to-end and integration tests:

```bash
mvn verify
```

#if( ${flavor} == "webforj-spring" )
This command runs your integration tests using Spring Boot Test framework. Tests annotated with `@SpringBootTest` will:
- Start the full Spring application context
- Run on a random port to avoid conflicts
- Execute Playwright browser tests against the running application
- Automatically shut down after tests complete
#else
This command:
- Starts Jetty before tests using the `jetty:start` goal
- Runs integration tests using the **Failsafe Plugin** (tests ending with `*IT.java`)
- Shuts down Jetty after tests complete
#end

#if( ${flavor} == "webforj-spring" )
${symbol_pound}${symbol_pound} Spring Boot Configuration

Configure your application using `src/main/resources/application.properties`:

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
mvn clean package -Pprod
java -jar target/${artifactId}-${version}.jar
```

Or build and run a Docker image:

```bash
# Build the Docker image
mvn spring-boot:build-image

# Run the Docker container
docker run -p 8080:8080 ${artifactId}:${version}

# Or run with environment variables
docker run -p 8080:8080 -e SPRING_PROFILES_ACTIVE=prod ${artifactId}:${version}
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