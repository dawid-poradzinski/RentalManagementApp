FROM maven:3.9.11-eclipse-temurin-25-alpine AS build

WORKDIR /app

COPY Backend ./Backend
COPY ModelsGenerator ./ModelsGenerator
COPY HLD/Schema.yaml ./HLD/Schema.yaml

RUN mvn clean compile -f ModelsGenerator/pom.xml
RUN mvn clean package -f Backend/pom.xml

FROM eclipse-temurin:25

WORKDIR /app

COPY --from=build /app/Backend/target/ski_rent_api-0.0.1-SNAPSHOT.jar /app/Backend/backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/Backend/backend.jar"]