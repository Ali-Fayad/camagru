# Java Web App Deployment Guide (WAR + Tomcat) on Ubuntu

This guide explains how to build, deploy, and update a Java web application packaged as a WAR file using Apache Tomcat. It also includes optional development shortcuts and troubleshooting tips.

---

## 1. Prerequisites

- Ubuntu VM
- Java JDK installed (>=17)
- Maven installed
- Apache Tomcat installed (tested on Tomcat 10)
- Your project set up as a Maven web application
- Optional: VS Code with Java and Tomcat extensions for easier deployment

---

## 2. Build the WAR

1. Open a terminal in your project directory.
2. Build the WAR with Maven:

```bash
mvn clean package

    The WAR file will be generated in the target/ folder:

target/java-web-app.war

    Note: mvn clean package only builds the WAR. It does not deploy it to Tomcat.

3. Deploy the WAR to Tomcat

    Copy the WAR file to Tomcat's webapps directory:

sudo cp target/java-web-app.war /opt/tomcat/webapps/

(Adjust /opt/tomcat to your Tomcat installation path.)

    Start Tomcat if it’s not running:

sudo systemctl start tomcat

    Access your app in a browser:

http://localhost:8080/java-web-app

    Tomcat automatically unpacks the WAR and deploys it.

4. Updating the App After Changes

    Modify your code.

    Rebuild the WAR:

mvn clean package

    Stop Tomcat (recommended for clean deployment):

sudo systemctl stop tomcat

    Replace the old WAR in webapps:

sudo cp target/java-web-app.war /opt/tomcat/webapps/

    Optional: Remove the exploded folder for a completely fresh deploy:

sudo rm -rf /opt/tomcat/webapps/java-web-app

    Start Tomcat again:

sudo systemctl start tomcat

    Refresh your browser to see the changes.

5. Development Convenience
Hot Reload with Maven Tomcat Plugin

    Add the plugin in your pom.xml:

<build>
  <plugins>
    <plugin>
      <groupId>org.apache.tomcat.maven</groupId>
      <artifactId>tomcat7-maven-plugin</artifactId>
      <version>2.2</version>
      <configuration>
        <url>http://localhost:8080/manager/text</url>
        <server>TomcatServer</server>
        <path>/java-web-app</path>
      </configuration>
    </plugin>
  </plugins>
</build>

    Deploy directly from Maven:

mvn tomcat7:deploy

IDE Integration

    VS Code: Use Java extensions + Tomcat extension for hot deploy.

    Eclipse/IntelliJ: Built-in Tomcat integration allows running and debugging without manual WAR copy.

6. Logs & Troubleshooting

    Tomcat logs are located in:

/opt/tomcat/logs/

    Check catalina.out for errors.

    Common issues:

        WAR name mismatch → adjust URL accordingly.

        Missing dependencies → ensure all libraries are in WEB-INF/lib.

        Permissions → make sure Tomcat user can read the WAR file.

7. Optional Cleanup

To completely remove an old deployment:

sudo rm -rf /opt/tomcat/webapps/java-web-app
sudo rm /opt/tomcat/webapps/java-web-app.war

Then deploy the new WAR.
8. Notes

    WAR is standard for Tomcat deployment.

    JAR is for standalone apps with embedded server (like Spring Boot).

    Always rebuild WAR after code changes.

    For faster development, consider Maven plugin or IDE hot deploy features.

    Keep a backup of your WAR for production safety.

9. Quick Cheat Sheet (Commands)

# Build WAR
mvn clean package

# Deploy to Tomcat
sudo cp target/java-web-app.war /opt/tomcat/webapps/
sudo systemctl start tomcat

# Update after changes
mvn clean package
sudo systemctl stop tomcat
sudo cp target/java-web-app.war /opt/tomcat/webapps/
sudo rm -rf /opt/tomcat/webapps/java-web-app   # optional
sudo systemctl start tomcat

# Check logs
tail -f /opt/tomcat/logs/catalina.out


---

This file **contains everything you need** for deploying, updating, debugging, and developing your Java web app with Tomcat.

If you want, I can also make a **version optimized for fast dev** where you never have to stop/start Tomcat manually for every build.

Do you want me to do that too?
```
