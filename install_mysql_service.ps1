$path = "C:\Program Files (x86)\EasyPHP-5.3.5.0"
$mysqld = "$path\mysql\bin\mysqld.exe"

Write-Host "=== Installing MySQL as Windows Service ===" -ForegroundColor Cyan

# Remove existing service if any
$existing = Get-Service "MySQL53" -ErrorAction SilentlyContinue
if ($existing) {
    Write-Host "Removing existing MySQL53 service..."
    Stop-Service "MySQL53" -Force -ErrorAction SilentlyContinue
    & $mysqld --remove "MySQL53"
    Start-Sleep -Seconds 2
}

# Install as service
Write-Host "Installing MySQL53 service..."
& $mysqld --install "MySQL53" "--basedir=$path/mysql" "--datadir=$path/mysql/data" "--port=3306" "--skip-innodb" "--skip-external-locking"

Start-Sleep -Seconds 2

# Set service to auto-start
$svc = Get-Service "MySQL53" -ErrorAction SilentlyContinue
if ($svc) {
    Set-Service "MySQL53" -StartupType Automatic
    Write-Host "Starting MySQL53 service..." -ForegroundColor Yellow
    Start-Service "MySQL53"
    Start-Sleep -Seconds 5
    $svc.Refresh()
    Write-Host "MySQL53 Status: $($svc.Status)" -ForegroundColor Green
} else {
    Write-Host "Service registration failed!" -ForegroundColor Red
}

netstat -an | Select-String ":3306"
Write-Host "Done! Press any key to close." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
