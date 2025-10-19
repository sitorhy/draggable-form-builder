FROM ubuntu/jre:21-24.04_stable
COPY target/project-publisher-0.0.1-SNAPSHOT.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]

EXPOSE 8081