# Multi-stage Dockerfile for Camagru
# Build stage
FROM maven:3.8-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mkdir -p src/main/webapp/stickers
RUN mvn clean package -DskipTests

# Runtime stage
FROM tomcat:10.1-jdk11
LABEL maintainer="camagru-team"

# Remove default Tomcat apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy WAR file
COPY --from=build /app/target/camagru.war /usr/local/tomcat/webapps/ROOT.war

# NOTE: Do NOT copy stickers here! Copying to ROOT/ before Tomcat starts
# prevents automatic WAR extraction. Instead, we'll let Tomcat extract the WAR,
# and stickers will be included in the WAR file itself during the build.

# Set environment variables (override with docker-compose)
ENV DB_URL=jdbc:postgresql://db:5432/camagru
ENV DB_USER=camagru
ENV DB_PASSWORD=camagrupwd

# Expose port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
