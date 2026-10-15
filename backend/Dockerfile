FROM eclipse-temurin:17-jdk
WORKDIR /app
COPY src ./src
COPY lib ./lib
RUN mkdir -p out && javac -cp "lib/*" -d out $(find src/main/java -name "*.java")
CMD ["java", "-cp", "out:lib/*", "com.onego.OneGoApplication"]
