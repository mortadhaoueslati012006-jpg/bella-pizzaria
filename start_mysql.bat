@echo off
echo Starting MySQL for Bella Pizzaria...
"C:\Program Files (x86)\EasyPHP-5.3.5.0\mysql\bin\mysqld.exe" --basedir="C:/Program Files (x86)/EasyPHP-5.3.5.0/mysql" --datadir="C:/Program Files (x86)/EasyPHP-5.3.5.0/mysql/data" --port=3306 --skip-innodb --skip-external-locking --console
pause
