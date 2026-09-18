@echo off
if "%JAVA_HOME%"=="" (
    if exist "C:\Users\Hp\.jdks\temurin-17.0.20" set "JAVA_HOME=C:\Users\Hp\.jdks\temurin-17.0.20"
)
set "MAVEN_CMD=C:\Users\Hp\.m2\wrapper\dists\apache-maven-3.9.16-bin\5grr65jo27hi51sujmtcldfovl\apache-maven-3.9.16\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    "%MAVEN_CMD%" %*
) else (
    mvn %*
)
