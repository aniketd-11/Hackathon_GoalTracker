# Use Maven image with OpenJDK 21 for the build stage
FROM jelastic/maven:3.9.5-openjdk-21 AS build

# Copy all files from the current directory to the container's working directory
COPY . .

# Package the application (skip tests for the build stage)
RUN mvn clean package -DskipTests

# Use a smaller OpenJDK 21 image for the runtime stage
FROM openjdk:21-jdk-slim

# Copy the JAR file from the build stage to the runtime stage
COPY --from=build /target/GoalTracker-0.0.1-SNAPSHOT.jar GoalTracker.jar

# Expose the application port
EXPOSE 8080

# Define the command to run the application
ENTRYPOINT ["java", "-jar", "GoalTracker.jar"]