# Use Maven with OpenJDK 21 for the build stage
FROM maven:3.9.5-eclipse-temurin-21 AS build

# Set the working directory for the build stage
WORKDIR /app

# Copy only the necessary files for dependency resolution
COPY pom.xml ./
RUN mvn dependency:resolve

# Copy the rest of the source code to the container
COPY src ./src

# Package the application (skip tests to speed up the build)
RUN mvn clean package -DskipTests

# Use a minimal JDK 21 image for the runtime stage
FROM eclipse-temurin:21-jdk-slim

# Set the working directory for the runtime stage
WORKDIR /app

# Copy the JAR file from the build stage to the runtime stage
COPY --from=build /app/target/GoalTracker-0.0.1-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8000

# Set the Java headless mode to prevent AWT issues in non-GUI environments
ENV JAVA_OPTS="-Djava.awt.headless=true"

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]