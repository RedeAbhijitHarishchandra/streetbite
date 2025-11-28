# Stop StreetBite Servers
# This script forcefully terminates processes on ports 8080 (Backend) and 3000 (Frontend)

Write-Host "Stopping StreetBite servers..." -ForegroundColor Cyan

# Function to stop process by port
function Stop-PortProcess ($port, $name) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $pidVal = $process.OwningProcess
        Write-Host "Stopping $name (Port $port, PID $pidVal)..." -ForegroundColor Yellow
        Stop-Process -Id $pidVal -Force -ErrorAction SilentlyContinue
        Write-Host "$name stopped." -ForegroundColor Green
    }
    else {
        Write-Host "$name is not running (Port $port free)." -ForegroundColor Gray
    }
}

# Stop Backend (8080)
Stop-PortProcess 8080 "Backend (Spring Boot)"

# Stop Frontend (3000)
Stop-PortProcess 3000 "Frontend (Next.js)"

Write-Host ""
Write-Host "All servers stopped." -ForegroundColor Green
