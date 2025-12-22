# Multi-stage Dockerfile for Camagru
# Build stage
FROM maven:3.8-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Runtime stage
FROM tomcat:9-jdk11
LABEL maintainer="camagru-team"

# Remove default Tomcat apps
RUN rm -rf /usr/local/tomcat/webapps/*

# Copy WAR file
COPY --from=build /app/target/camagru.war /usr/local/tomcat/webapps/ROOT.war

# Create directories for uploads and stickers
RUN mkdir -p /usr/local/tomcat/webapps/ROOT/uploads
RUN mkdir -p /usr/local/tomcat/webapps/ROOT/stickers

# Copy sticker assets (if they exist)
COPY src/main/webapp/stickers/* /usr/local/tomcat/webapps/ROOT/stickers/ 2>/dev/null || :

# Set environment variables (override with docker-compose)
ENV DB_URL=jdbc:postgresql://db:5432/camagru
ENV DB_USER=camagru
ENV DB_PASSWORD=camagrupwd

# Expose port
EXPOSE 8080

# Start Tomcat
CMD ["catalina.sh", "run"]
