@echo off
echo ============================================
echo   Bella Pizzaria - MySQL Setup
echo ============================================
echo.

set MYSQLDIR=C:\Program Files (x86)\EasyPHP-5.3.5.0\mysql

REM Stop and remove old service if exists
net stop MySQL53 2>nul
sc delete MySQL53 2>nul
timeout /t 2 /nobreak >nul

REM Install MySQL as a service
echo Installing MySQL service...
"C:\Program Files (x86)\EasyPHP-5.3.5.0\mysql\bin\mysqld.exe" --install MySQL53 "--basedir=C:/Program Files (x86)/EasyPHP-5.3.5.0/mysql" "--datadir=C:/Program Files (x86)/EasyPHP-5.3.5.0/mysql/data" "--skip-innodb" "--skip-external-locking" "--port=3306"

echo.
echo Starting MySQL service...
net start MySQL53
timeout /t 5 /nobreak >nul

echo.
echo Checking status...
netstat -an | findstr :3306

echo.
echo Creating database pizzeria1_db...
"C:\Program Files (x86)\EasyPHP-5.3.5.0\mysql\bin\mysql.exe" -u root -h 127.0.0.1 -P 3306 -e "CREATE DATABASE IF NOT EXISTS pizzeria1_db CHARACTER SET utf8;"

echo Importing SQL...
"C:\Program Files (x86)\EasyPHP-5.3.5.0\mysql\bin\mysql.exe" -u root -h 127.0.0.1 -P 3306 pizzeria1_db < "C:\Program Files (x86)\EasyPHP-5.3.5.0\www\bellapizzaria2\pizzeria1_db.sql"

echo.
echo ============================================
echo   DONE! Opening app in browser...
echo ============================================
start "" "http://127.0.0.1:8888/bellapizzaria2/"
pause
