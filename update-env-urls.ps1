# Script to replace hardcoded localhost URLs with environment variable

$files = @(
    "src\Cadets\CadetSignup.jsx",
    "src\components\EmailVerificationPage.jsx",
    "src\components\DrillVideoAdminPage.jsx",
    "src\Cadets\CadetQueryBox.jsx",
    "src\Cadets\CadetProfilePage.jsx",
    "src\components\CadetManagementPage.jsx",
    "src\components\AdminLogin.jsx",
    "src\components\AdminQueryBox.jsx",
    "src\Cadets\CadetEventViewPage.jsx",
    "src\Cadets\CadetDashboardContent.jsx",
    "src\components\AdminEventUpdatePage.jsx",
    "src\components\AdminDashboardContent.jsx",
    "src\Cadets\CadetDashboard.jsx",
    "src\components\AdminDashboard.jsx",
    "src\Cadets\CadetAttendancePage.jsx",
    "src\components\AdminAttendancePage.jsx"
)

$apiUrlConstant = @"
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

"@

foreach ($file in $files) {
    $fullPath = "E:\FSD\NCC_PORTEL\Frontend\$file"
    
    if (Test-Path $fullPath) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        
        $content = Get-Content $fullPath -Raw
        
        # Check if API_URL constant already exists
        if ($content -notmatch 'const API_URL') {
            # Find the first line after imports (after last import or first function/const)
            $lines = $content -split "`r?`n"
            $insertIndex = 0
            
            for ($i = 0; $i -lt $lines.Count; $i++) {
                if ($lines[$i] -match '^import ') {
                    $insertIndex = $i + 1
                }
                elseif ($insertIndex -gt 0 -and $lines[$i] -match '^\s*$') {
                    continue
                }
                elseif ($insertIndex -gt 0) {
                    break
                }
            }
            
            # Insert API_URL constant
            $lines = @($lines[0..$insertIndex]) + $apiUrlConstant + @($lines[($insertIndex+1)..($lines.Count-1)])
            $content = $lines -join "`r`n"
        }
        
        # Replace all occurrences
        $content = $content -replace '"http://localhost:5000', '`${API_URL}'
        $content = $content -replace "'http://localhost:5000", '`${API_URL}'
        $content = $content -replace '`http://localhost:5000', '`${API_URL}'
        
        # Save the file
        [System.IO.File]::WriteAllText($fullPath, $content)
        Write-Host "✅ Updated: $file" -ForegroundColor Green
    }
    else {
        Write-Host "⚠️  Not found: $file" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Migration complete!" -ForegroundColor Cyan
Write-Host "Total files processed: $($files.Count)" -ForegroundColor Cyan
