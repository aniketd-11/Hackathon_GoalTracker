# Use Maven image with OpenJDK 21 for the build stage
FROM jelastic/maven:3.9.5-openjdk-21 AS build

# Copy all files from the current directory to the container's working directory
COPY . .

# Package the application (skip tests for the build stage)
RUN mvn clean package -DskipTests

# Use a smaller OpenJDK 21 image for the runtime stage
FROM openjdk:21-jdk-slim

# Install necessary libraries for font rendering(Excel creation)
RUN apt-get update && apt-get install -y libfreetype6 libfontconfig1

# Copy the JAR file from the build stage to the runtime stage
COPY --from=build /target/GoalTracker-0.0.1-SNAPSHOT.jar GoalTracker.jar

# Expose the application port
EXPOSE 8080

# Set the Java headless mode to prevent AWT issues in non-GUI environments
ENV JAVA_OPTS="-Djava.awt.headless=true"

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "GoalTracker.jar"]