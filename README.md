# webforJ Archetypes

[![Publish](https://github.com/webforj/webforj-archetypes/actions/workflows/publish.yml/badge.svg)](https://github.com/webforj/webforj-archetypes/actions/workflows/publish.yml)

This repository hosts several application starters to scaffold webforJ applications.

## Using the Available Archetypes

Navigate to the folder where you want to create your new project, then run the following command. Replace `${webforj-archetype-X}` with the [desired archetype](#available-archetypes) name and `${webforj.version}` with the version you want to use.

> **Note:** If you don't know which version to use, replace `${webforj.version}` with `LATEST`.

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

| Archetype Name | Description |
|----------------|-------------|
| **webforj-archetype-sidemenu** | A starting project with a side menu and navigation in the content area. |
| **webforj-archetype-tabs** | A starting project with a simple tabbed interface. |
| **webforj-archetype-hello-world** | A webforJ "Hello World" starter. Use `webforj-archetype-hello-world` to deploy as standalone WAR and `webforj-archetype-bbj-hello-world` to deploy as standalone JAR for applications running on BBjServices. |
| **webforj-archetype-blank** | A blank starter project for webforJ applications. |
