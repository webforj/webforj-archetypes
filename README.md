# webforJ Archetypes

[![Publish](https://github.com/webforj/webforj-archetypes/actions/workflows/publish.yml/badge.svg)](https://github.com/webforj/webforj-archetypes/actions/workflows/publish.yml)

This repository hosts several application starters to scaffold webforJ applications.

## Using the Available Archetypes

Navigate to the folder where you want to create your new project, then run the following command. Replace `${webforj-archetype-X}` with the desired archetype name and `${webforj.version}` with the version you want to use.

```shell
mvn -B archetype:generate \
-DarchetypeGroupId=com.webforj \
-DarchetypeArtifactId=${webforj-archetype-X} \
-DarchetypeVersion=${webforj.version} \
-DgroupId=org.example \
-DartifactId=my-webapp \
-Dversion=1.0-SNAPSHOT
```

## Available Archetypes

1. **webforj-archetype-hello-world**  
   A "Hello World" starter designed for developers who want to deploy webforJ applications as standalone WAR files.

2. **webforj-archetype-bbj-hello-world**  
   A "Hello World" starter tailored for creating and deploying webforJ applications running on BBjServices.
