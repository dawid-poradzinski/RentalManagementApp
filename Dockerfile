# OpenApi models

FROM docker.io/maven:3.9.11-eclipse-temurin-25-alpine AS models-build

WORKDIR /app

COPY ModelsGenerator ./ModelsGenerator
COPY HLD/Schema.yaml ./HLD/Schema.yaml

RUN mvn clean compile -f ModelsGenerator/pom.xml

# Frontend

FROM docker.io/node:20-alpine AS frontend-build

WORKDIR /app

COPY Frontend ./
COPY --from=models-build ./app/Frontend ./

RUN npm install
RUN npm install @tabler/icons@latest
RUN npm run build

# Backend

FROM docker.io/maven:3.9.11-eclipse-temurin-25-alpine AS backend-build

WORKDIR /app

COPY Backend ./Backend
COPY --from=models-build /app/Backend ./Backend
COPY --from=frontend-build /app/dist ./Backend/src/main/resources/static

RUN mvn clean package -f ./Backend/pom.xml

# Final image

FROM docker.io/eclipse-temurin:25

WORKDIR /app

COPY --from=backend-build /app/Backend/target/ski_rent_api-0.0.1-SNAPSHOT.jar /app/Backend/backend.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/Backend/backend.jar"]